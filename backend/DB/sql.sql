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