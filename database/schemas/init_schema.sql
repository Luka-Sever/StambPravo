-- schema ver 1.1

-- create user table
CREATE TABLE CO_OWNER (
	co_owner_id SERIAL PRIMARY KEY,
	username VARCHAR(20) NOT NULL UNIQUE,
	passwd VARCHAR(100) NOT NULL,
	first_name VARCHAR(20) NOT NULL,
	last_name VARCHAR(20) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	role_type VARCHAR(20) NOT NULL,
	building_id INTEGER NOT NULL
);

-- create city table
CREATE TABLE CITY (
	city_id SERIAL PRIMARY KEY,
	postal_code INTEGER NOT NULL UNIQUE,
	city_name VARCHAR(50) NOT NULL
);

-- create building table
CREATE TABLE BUILDING (
	building_id SERIAL PRIMARY KEY,
	city_id INTEGER NOT NULL REFERENCES CITY(city_id),
	address VARCHAR(100) NOT NULL,
	rep_id INTEGER UNIQUE,
	CONSTRAINT city_address UNIQUE (city_id, address)
);

-- assign foreign key references
ALTER TABLE CO_OWNER
	ADD CONSTRAINT fk_coowner_building FOREIGN KEY (building_id) REFERENCES BUILDING(building_id);
ALTER TABLE BUILDING
	ADD CONSTRAINT fk_building_rep FOREIGN KEY (rep_id) REFERENCES CO_OWNER(co_owner_id);

-- create indexes
CREATE INDEX i_coowner_by_building ON CO_OWNER (building_id);
CREATE INDEX i_building_by_rep ON BUILDING (rep_id);
