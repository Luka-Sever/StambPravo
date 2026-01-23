-- initial values for city and coowner

INSERT INTO CITY (postal_code, city_name)
VALUES (10000, 'ZAGREB'), (47000, 'KARLOVAC'), (23000, 'ZADAR');

INSERT INTO CO_OWNER (username, passwd, first_name, last_name, email, role_type)
VALUES ('admin', '$2a$10$Q/c.UZ7KcN6fputDybV7FeLkPV25MP/1xZd6dtJQukeJbX252PzQq', 'Bruno', 'Plese', 'brunoplese0@gmail.com', 'ADMIN');