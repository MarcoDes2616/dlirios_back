const cron = require('node-cron');
const Order = require('../models/order.models');
const ProductInOrder = require('../models/productInOrder.models');
const Warning = require('../models/warning.models');
const OrderDeads = require('../models/ordersDead');
const PioDead = require('../models/pioDead');
const transporter = require('./mailer');
const Users = require('../models/users.models');
const { mailWarning, mailCancel } = require('./mail');
const ORDER_PAYMENT_DURATION = 36;
const ORDER_PAYMENT_WARNING = 48;
require("dotenv").config();

function cancelOrdersJob() {
  cron.schedule('0 * * * *', async() => {
    // Aquí debe obtener todas las órdenes que están en estado "pendiente de pago" y que no han sido completadas.
    const orders = await Order.findAll({
      include: {
        model: ProductInOrder,
        attributes: {
          exclude: ["id"]
        }
      }
    })

    // Verifique cada orden pendiente de pago
    setTimeout(() => {
      orders.filter(order => !order.is_completed).forEach(async (order) => {
        // Calcule la fecha límite para el pago
        // const created = new Date(order.createdAt).getTime()
        const warningline = new Date(order.createdAt.setHours(order.createdAt.getHours() + 36)).getTime();
        const deadline = new Date(order.createdAt.setHours(order.createdAt.getHours() + 12)).getTime();
        const now = Date.now();

        const exist = await Warning.findOne({
          where: {
            order_id: order.id
          }
        })

        if (now > warningline && !exist) {
          warn(order)
        }
        
        if (now > deadline) {
          orderCancel(order)
        }
      }); // cierre filter
    }, 500)
  }); //cierre de cron
}

module.exports = cancelOrdersJob




const warn = async (order) => {
  try {
    await Warning.create({ order_id: order.id })
    const user = await Users.findByPk(order.user_id)
    if (user) {
      await transporter.sendMail({
        from: process.env.MAILER_CONFIG_USER,
        to: user.email,
        subject: "Orden en riesgo de Cancelación",
        html: mailWarning(user, order),
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const orderCancel = async (order) => {
  try {
    await OrderDeads.create({ order_id: order.id, user_id: order.user_id, total: order.total })
    order.product_in_orders.forEach(async ({product_id, order_id, quantity, sub_total}) => {
      const user = await Users.findByPk(order.user_id)
      if (user) {
        await PioDead.create({product_id, order_id, quantity, sub_total})
        await transporter.sendMail({
          from: process.env.MAILER_CONFIG_USER,
          to: user.email,
          subject: "Orden ha sido cancelada",
          html: mailCancel(user, order),
        });
      }
      await Order.destroy({ where: { id: order.id } })
    })
  } catch (error) {
    console.log(error);
  }
}
