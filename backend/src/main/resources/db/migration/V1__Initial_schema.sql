-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create tiers table
CREATE TABLE tiers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    min_points BIGINT NOT NULL,
    max_points BIGINT NOT NULL,
    benefits_description TEXT,
    priority INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create stores table
CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(500),
    city VARCHAR(255),
    country VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    membership_code VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(50),
    address VARCHAR(500),
    city VARCHAR(255),
    country VARCHAR(255),
    tier_id BIGINT REFERENCES tiers(id),
    current_points_balance BIGINT NOT NULL DEFAULT 0,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create campaigns table
CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    earning_multiplier DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    conditions TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create earning_rules table
CREATE TABLE earning_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_points_per_currency_unit DOUBLE PRECISION NOT NULL,
    min_amount DECIMAL(19, 2),
    max_amount DECIMAL(19, 2),
    store_id BIGINT REFERENCES stores(id),
    tier_id BIGINT REFERENCES tiers(id),
    campaign_id BIGINT REFERENCES campaigns(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create rewards table
CREATE TABLE rewards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_points BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create loyalty_transactions table
CREATE TABLE loyalty_transactions (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    store_id BIGINT NOT NULL REFERENCES stores(id),
    type VARCHAR(50) NOT NULL,
    points BIGINT NOT NULL,
    transaction_amount DECIMAL(19, 2),
    description TEXT,
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create reward_redemptions table
CREATE TABLE reward_redemptions (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    reward_id BIGINT NOT NULL REFERENCES rewards(id),
    points_used BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    store_id BIGINT NOT NULL REFERENCES stores(id),
    handled_by BIGINT REFERENCES users(id),
    redeemed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_customers_membership_code ON customers(membership_code);
CREATE INDEX idx_customers_tier ON customers(tier_id);
CREATE INDEX idx_transactions_customer ON loyalty_transactions(customer_id);
CREATE INDEX idx_transactions_store ON loyalty_transactions(store_id);
CREATE INDEX idx_transactions_type ON loyalty_transactions(type);
CREATE INDEX idx_transactions_created_at ON loyalty_transactions(created_at);
CREATE INDEX idx_redemptions_customer ON reward_redemptions(customer_id);
CREATE INDEX idx_redemptions_status ON reward_redemptions(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, role, status) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6w2', 'admin@loyalty.com', 'ADMIN', 'ACTIVE');

-- Insert default tiers
INSERT INTO tiers (name, min_points, max_points, benefits_description, priority) VALUES
('Bronze', 0, 999, 'Basic tier with standard benefits', 1),
('Silver', 1000, 4999, 'Silver tier with enhanced benefits', 2),
('Gold', 5000, 9999, 'Gold tier with premium benefits', 3),
('Platinum', 10000, 999999999, 'Platinum tier with exclusive benefits', 4);

-- Insert default earning rule
INSERT INTO earning_rules (name, base_points_per_currency_unit, active) VALUES
('Default Rule', 0.01, true);

