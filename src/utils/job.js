const cron = require('node-cron');
const Order = require('../models/order.models');
const ProductInOrder = require('../models/productInOrder.models');
const Warning = require('../models/warning.models');
const OrderDeads = require('../models/ordersDead');
const PioDead = require('../models/pioDead');
const { transporter } = require('./mailer');
const Users = require('../models/users.models');
const ORDER_PAYMENT_DURATION = 2;
const ORDER_PAYMENT_WARNING = 1;
require("dotenv").config();

function cancelOrdersJob() {
  cron.schedule('0 * * * * *', async() => {
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
      console.log("voy");
      orders.filter(order => !order.is_completed).forEach(async (order) => {
        // Calcule la fecha límite para el pago
        const created = new Date(order.createdAt).getTime()
        const warningline = new Date(order.createdAt.setHours(order.createdAt.getHours() + 1)).getTime();
        const deadline = new Date(order.createdAt.setHours(order.createdAt.getHours() + 1)).getTime();
        const now = Date.now();
        const exist = await Warning.findByPk(order.id)

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
      console.log("voy pal correo");
      await transporter.sendMail({
        from: process.env.MAILER_CONFIG_USER,
        to: user.email,
        subject: "Orden en riesgo de Cancelación",
        html: `
          <p>Hola ${user.username}, queremos informarte que tu orden creada el ${order.createdAt}, esta en riesgo de ser cancelada</p>
          <p>Redcuerda que tienes 48horas a partir de tu compra para realizar el pago correspondiente (${order.total})</p>
          <br/>
          <p>Algunas consideraciones son importantes:</p>
          <ul>
            <li>Todas tus compras tiene un tiempo maximo de 48horas para mantener en reserva tus artículos</li>
            <li>Una vez realizado el pago correspondiente, recuerda dirigirte a tus compras y avisarnos sobre ello (marcar pagado)</li>
            <li>Para mejor experiencia, podrias comunicarte con Insumos Dlirios haciendo <a href="https://chat.whatsapp.com/DrTDWypZc0u0pGp89QleGr">Click Aqui</a> </li>
          </ul>
          <p>Si ya cancelaste el monto de tu orden, ignora este mensaje</p>
          `,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const orderCancel = async (order) => {
  console.log("voy al dead");
  try {
    await OrderDeads.create({ order_id: order.id, total: order.total })
    order.product_in_orders.forEach(async (product) => {
      await PioDead.create(product)
      const user = await Users.findByPk(order.user_id)
      if (user) {
        await transporter.sendMail({
          from: process.env.MAILER_CONFIG_USER,
          to: user.email,
          subject: "Orden ha sido cancelada",
          html: `
            <p>Hola ${user.username}, queremos informarte que tu orden creada el ${order.created_at}, fue cancelada</p>
            <p>Redcuerda que tienes 48horas a partir de tu compra para realizar el pago correspondiente (${order.total})</p>
            <br/>
            <p>Algunas consideraciones son importantes:</p>
            <ul>
              <li>Todas tus compras tiene un tiempo maximo de 48horas para mantener en reserva tus artículos</li>
              <li>Una vez realizado el pago correspondiente, recuerda dirigirte a tus compras y avisarnos sobre ello (marcar pagado)</li>
            </ul>
            <p>Si consideras que hubo un error, te invitamos a comunicarte con Insumos Dlirios haciendo <a href="https://chat.whatsapp.com/DrTDWypZc0u0pGp89QleGr">Click Aqui</a></p>
            `,
        });
      }
      await Order.destroy({ where: { id: order.id } })
    })
  } catch (error) {
    console.log(error);
  }
}
