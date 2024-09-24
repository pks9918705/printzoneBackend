const Order = require('../models/Order');
const Party = require('../models/Party');

// i have addes a new line

const nodemailer = require('nodemailer'); // Import Nodemailer
const ejs = require('ejs'); // Import EJS for templating

// Nodemailer configuration (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"pks9918705@gmail.com", // Your email address
    pass:"vtiw shjp qdmh hvqw", // Your email password or app-specific password
  },
});



// Function to send an email
const sendOrderConfirmationEmail = async (customerEmail, orderDetails) => {
  console.log(customerEmail,orderDetails)
  try {
    // Load HTML template from an external file (EJS used for templating)
    const htmlTemplate = await ejs.renderFile('./templates/orderConfirmation.ejs', { orderDetails });

    // Define email options
    const mailOptions = {
      // from: process.env.EMAIL_USER, // Sender address
      from:"pks9918705@gmail.com", // Sender address
      to: customerEmail, // List of recipients
      subject: `Order Confirmation - Order #${orderDetails._id}`,
      html: htmlTemplate, // HTML body with order details
    };

    console.log("Mail options",mailOptions)
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${customerEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



// Function to send dispatch email
const sendDispatchEmail = (order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customerEmail, // Assuming the order has customerEmail field
    subject: `Your Order #${order._id} has been Dispatched!`,
    html: `
      <h2>Dear ${order.customerName},</h2>
      <p>We are pleased to inform you that your order with ID <strong>#${order._id}</strong> has been successfully dispatched.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li>Order ID: ${order._id}</li>
        <li>Product: ${order.productName}</li>
        <li>Quantity: ${order.quantity}</li>
        <li>Total Amount: $${order.totalPrice}</li>
        <li>Status: Dispatched</li>
      </ul>
      <p>We hope to serve you again soon.</p>
      <br>
      <p>Best regards,</p>
      <p>Your Company Name</p>
    `,
  }};


// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.partyId) {
      return res.status(400).json({ message: 'partyId is required' });
    }

    console.log(req.body)
    // Create a new order
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    // Find the party by ID and update their orderId array
    const partyId = req.body.partyId; // Extract partyId from the request body
    const party = await Party.findById(partyId);
    

    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    await Party.findByIdAndUpdate(
      partyId,
      { $push: { orderId: savedOrder._id } }, // Add the new order ID to the party's orderId array
      { new: true } // Return the updated document
    );
    console.log("Party Email",party.email)
    // Send an email to the customer after order creation
    await sendOrderConfirmationEmail(party.email, savedOrder);

    // Respond with the created order
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);  // Log error details for debugging

    // Determine error type and send appropriate response
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }

    // Handle other potential errors
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get the last 50 orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })  // Sort by creation date in descending order
      .limit(100)  // Limit the number of results to 50
      .populate('partyId');  // Populates party details

    if (orders.length === 0) return res.status(404).json({ message: 'No orders found' });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);  // Log error details for debugging
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('partyId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);  // Log error details for debugging
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update an order
// exports.updateOrder = async (req, res) => {
//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error('Error updating order:', error);  // Log error details for debugging
//     res.status(500).json({ message: 'Error updating order', error: error.message });
//   }
// };
exports.updateOrder = async (req, res) => {
  try {
    // Find the existing order
    const existingOrder = await Order.findById(req.params.id);
    console.log(existingOrder)
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });

    // Update the order details
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    // Check if the status has been updated to "Dispatched"
    if (req.body.status === 'Dispatch' && existingOrder.status !== 'Dispatch') {
      // Send the dispatch email
      await sendDispatchEmail(updatedOrder);
    }

    // Respond with the updated order details
    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error); // Log error details for debugging
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);  // Log error details for debugging
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
