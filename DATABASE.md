# Database

### User Schema
```
{
    _id: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}
```

### Session Schema
```
{
    _id: { type: String, ref: 'User' },
    login: [{
        timestamp: { type: Date },
        ip: { type: String }
    }],
    logout: [{
        timestamp: { type: Date },
        ip: { type: String }
    }]
}
```

### Product Schema
```
{
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    stock: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}
```

### Cart Schema
```
{
    _id: { type: String },
    products: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }]
}
```

### Order Schema
```
{
    user_id: { type: String },
    products: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    total_amount: { type: Number },
    order_date: { type: Date }
}
```