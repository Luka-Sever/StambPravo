-- schema ver 1.0

-- create co_owner table
CREATE TABLE CO_OWNER (
	Co_ownerId SERIAL PRIMARY KEY,
	Username VARCHAR(20) NOT NULL UNIQUE,
	PasswordHash VARCHAR(100) NOT NULL,
	FirstName VARCHAR(20) NOT NULL,
	LastName VARCHAR(20) NOT NULL,
	Email VARCHAR(100) NOT NULL UNIQUE,
	BuildingId INTEGER NOT NULL
);

-- create city table
CREATE TABLE CITY (
	CityId SERIAL PRIMARY KEY,
	PostalCode INTEGER NOT NULL UNIQUE,
	CityName VARCHAR(50) NOT NULL
);

-- create building table
CREATE TABLE BUILDING (
	BuildingId SERIAL PRIMARY KEY,
	CityId INTEGER NOT NULL REFERENCES CITY(CityId),
	Address VARCHAR(100) NOT NULL,
	RepId INTEGER UNIQUE,
	CONSTRAINT city_address UNIQUE (CityId, Address)
);

-- assign foreign key references
ALTER TABLE CO_OWNER
	ADD CONSTRAINT fk_user_building FOREIGN KEY (BuildingId) REFERENCES BUILDING(BuildingId);
ALTER TABLE BUILDING
	ADD CONSTRAINT fk_building_rep FOREIGN KEY (RepId) REFERENCES CO_OWNER(Co_ownerId);

-- create indexes
CREATE INDEX i_coowner_by_building ON CO_OWNER (BuildingId);
CREATE INDEX i_building_by_rep ON BUILDING (RepId);
