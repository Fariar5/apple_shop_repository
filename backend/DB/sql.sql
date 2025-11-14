CREATE TABLE specifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
)

CREATE TABLE product_spec (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    specification_id INTEGER REFERENCES specifications(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL
)

CREATE TABLE variant_attributes (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  attribute_value_id INTEGER REFERENCES attribute_values(id) ON DELETE CASCADE
);

CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  price NUMERIC(10,2),
  stock INTEGER DEFAULT 0
);

CREATE TABLE attribute_values (
  id SERIAL PRIMARY KEY,
  attribute_id INTEGER REFERENCES attributes(id) ON DELETE CASCADE,
  value VARCHAR(100) NOT NULL
);



-- shopping card tables
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, canceled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  variant_id INTEGER REFERENCES product_variants(id),
  quantity INTEGER DEFAULT 1,
  price NUMERIC(10,2) NOT NULL, -- قیمت لحظه‌ای هنگام اضافه کردن به سبد
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  cart_id INTEGER REFERENCES carts(id),
  total NUMERIC(12,2),
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, shipped, delivered
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


SELECT 
ci.id AS cart_item_id,
p.id AS product_id,
ci.variant_id AS variant_id,
p.name AS name,
ci.quantity AS quantity,
ci.price AS price
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN cart_items ci ON pv.id = ci.variant_id;

SELECT c.id AS id,c.product_id AS product_id,u.name AS username,c.text AS text FROM comments c JOIN users u ON c.user_id = u.id WHERE product_id=1

-- commets table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  text VARCHAR(200)
)