

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shopsmart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'));

// Schema Models
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String, // 'user' | 'seller' | 'admin'
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    sellerId: mongoose.Schema.Types.ObjectId,
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    products: [{
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
    }],
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now },
}));

// Routes
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.send({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.send(user);
    else res.status(401).send({ message: 'Invalid credentials' });
});

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send({ message: 'Product added' });
});

app.post('/order', async (req, res) => {
    const { userId, products, totalAmount } = req.body;
    const order = new Order({ userId, products, totalAmount });
    await order.save();
    res.send({ message: 'Order placed' });
});

app.listen(5000, () => console.log('Server started on port 5000'));


