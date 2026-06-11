-- ============================================
-- A2C International - Seed de inventario demo
-- ============================================
-- Ejecutar DESPUÉS de schema.sql en Supabase Dashboard > SQL Editor.
-- Replica el dataset de src/lib/demoData.js para que el sitio recién
-- conectado muestre el mismo inventario que el modo demo.

WITH seed AS (
  INSERT INTO vehicles
    (brand, model, year, price_usd, mileage, fuel_type, transmission, engine, color, interior_color, doors, condition, body_type, description, features, status, featured, vehicle_history)
  VALUES
    ('Mercedes-Benz', 'AMG GT', 2023, 148500, 9800, 'Gasolina', 'Automática', 'V8 Biturbo 4.0L · 577 HP', 'Gris Selenita', 'Negro / Rojo', 2, 'Usado', 'Coupe', 'Deportivo insignia de Mercedes-AMG. Motor V8 biturbo hecho a mano, escape deportivo AMG Performance y paquete aerodinámico de fábrica. Unidad importada con historial certificado.', ARRAY['Escape AMG Performance','Asientos AMG en napa','Burmester Surround','Cámara 360°','Paquete Noche AMG'], 'disponible', true, 'Historial verificado, título limpio.'),
    ('Land Rover', 'Range Rover Sport HSE', 2024, 112000, 6500, 'Gasolina', 'Automática', 'I6 MHEV 3.0L · 395 HP', 'Negro Santorini', 'Caramelo', 4, 'Usado', 'SUV', 'Versatilidad británica con confort extremo. Suspensión neumática adaptativa, tracción total permanente y tercera fila opcional. Ideal para ciudad y montaña.', ARRAY['Suspensión neumática','Meridian Signature','Head-Up Display','Asientos ventilados','Terrain Response 2'], 'disponible', true, 'Historial verificado, título limpio.'),
    ('Porsche', '911 Carrera S', 2022, 139900, 14200, 'Gasolina', 'Automática', 'Boxer 6 Biturbo 3.0L · 443 HP', 'Amarillo Racing', 'Negro', 2, 'Usado', 'Coupe', 'El ícono atemporal. PDK de 8 velocidades, paquete Sport Chrono y dirección trasera activa. Mantenimientos al día en casa de marca.', ARRAY['Sport Chrono','PASM','Escape deportivo','BOSE Surround','Llantas Carrera S 20/21"'], 'disponible', true, 'Historial verificado, título limpio.'),
    ('Toyota', 'Land Cruiser 300 VX', 2024, 128000, 3200, 'Diesel', 'Automática', 'V6 Twin-Turbo Diesel 3.3L · 304 HP', 'Blanco Perla', 'Beige', 4, 'Nuevo', 'SUV', 'La referencia absoluta en SUV de lujo todoterreno para el mercado dominicano. Siete plazas, KDSS electrónico y fiabilidad legendaria.', ARRAY['7 plazas','E-KDSS','Multi-Terrain Select','JBL Premium','Asientos ventilados'], 'disponible', true, 'Historial verificado, título limpio.'),
    ('BMW', 'M4 Competition', 2023, 96500, 11900, 'Gasolina', 'Automática', 'I6 Biturbo 3.0L · 503 HP', 'Azul Portimao', 'Negro / Azul', 2, 'Usado', 'Coupe', 'Precisión alemana en estado puro. M xDrive, frenos M Compound y asientos baquet M Carbon. Una máquina de manejo para el día a día.', ARRAY['M xDrive','Asientos M Carbon','Harman Kardon','Laserlight','M Drive Professional'], 'disponible', false, 'Historial verificado, título limpio.'),
    ('Tesla', 'Model 3 Long Range', 2024, 47900, 8400, 'Eléctrico', 'Automática', 'Dual Motor AWD · 510 km autonomía', 'Rojo Multicapa', 'Negro', 4, 'Usado', 'Sedan', 'Cero combustible, cero mantenimiento complejo. Autopilot, techo panorámico de cristal y carga rápida. La puerta de entrada a la movilidad eléctrica premium.', ARRAY['Autopilot','Techo de cristal','Supercharging','Premium Connectivity','Sentry Mode'], 'disponible', true, 'Historial verificado, título limpio.'),
    ('Toyota', 'Hilux SRV 4x4', 2023, 42500, 26700, 'Diesel', 'Automática', 'Turbo Diesel 2.8L · 201 HP', 'Gris Oscuro', 'Negro', 4, 'Usado', 'Pickup', 'La pickup más confiable del país. Doble cabina, tracción 4x4 con bloqueo y cama protegida. Lista para trabajo o aventura.', ARRAY['4x4 con bloqueo','Cámara de retroceso','Control de descenso','Bedliner','Estribos laterales'], 'disponible', false, 'Historial verificado, título limpio.'),
    ('Honda', 'CR-V EX-L', 2023, 38900, 19500, 'Híbrido', 'Automática', 'Híbrido e:HEV 2.0L · 204 HP', 'Plata Lunar', 'Gris', 4, 'Usado', 'SUV', 'El SUV familiar por excelencia, ahora híbrido. Consumo mínimo en ciudad, Honda Sensing de serie y maletero gigante.', ARRAY['Honda Sensing','Asientos en piel','Portón eléctrico','CarPlay/Android Auto','Techo solar'], 'disponible', false, 'Historial verificado, título limpio.'),
    ('Ford', 'Mustang GT Premium', 2022, 56800, 17800, 'Gasolina', 'Manual', 'V8 Coyote 5.0L · 450 HP', 'Rojo Race', 'Negro', 2, 'Usado', 'Convertible', 'V8 atmosférico y caja manual de 6 velocidades: la combinación que ya casi no existe. Convertible, escape activo y modo pista.', ARRAY['Escape activo','Modo pista','Asientos Recaro','B&O Sound','Launch control'], 'reservado', false, 'Historial verificado, título limpio.'),
    ('Hyundai', 'Santa Fe Calligraphy', 2024, 49500, 5100, 'Gasolina', 'Automática', 'Turbo 2.5L · 281 HP', 'Verde Bosque Mate', 'Camel', 4, 'Nuevo', 'SUV', 'El nuevo diseño que está dando de qué hablar. Tres filas, interior tipo lounge y garantía de fábrica vigente.', ARRAY['7 plazas','Doble pantalla curva 12.3"','Asientos relax 2da fila','Bose Premium','Highway Drive Assist'], 'disponible', false, 'Historial verificado, título limpio.'),
    ('Toyota', 'Corolla SE', 2022, 24900, 31200, 'Gasolina', 'Automática', '2.0L Dynamic Force · 169 HP', 'Blanco', 'Negro', 4, 'Usado', 'Sedan', 'El sedán más vendido del mundo. Económico, confiable y con Toyota Safety Sense completo. Perfecto primer auto o flota ejecutiva.', ARRAY['Toyota Safety Sense','Pantalla 8"','Cámara de retroceso','Llantas 18"','Control crucero adaptativo'], 'disponible', false, 'Historial verificado, título limpio.'),
    ('Mercedes-Benz', 'G 63 AMG', 2021, 189000, 22400, 'Gasolina', 'Automática', 'V8 Biturbo 4.0L · 577 HP', 'Negro Obsidiana', 'Rojo Clásico', 5, 'Usado', 'SUV', 'El G-Wagon que no necesita presentación. Vendido a un cliente de nuestra cartera — pregunta por unidades similares en camino.', ARRAY['Paquete Noche AMG','Escape lateral AMG','Burmester 3D','Asientos masaje','Multibeam LED'], 'vendido', false, 'Historial verificado, título limpio.')
  RETURNING id, model
)
INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_primary)
SELECT s.id, i.url, i.ord, i.ord = 0
FROM seed s
JOIN LATERAL (
  VALUES
    ('AMG GT', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', 0),
    ('AMG GT', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 1),
    ('AMG GT', 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=1200&q=80', 2),
    ('Range Rover Sport HSE', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', 0),
    ('Range Rover Sport HSE', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80', 1),
    ('911 Carrera S', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 0),
    ('911 Carrera S', 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&w=1200&q=80', 1),
    ('Land Cruiser 300 VX', 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80', 0),
    ('Land Cruiser 300 VX', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80', 1),
    ('M4 Competition', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 0),
    ('M4 Competition', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 1),
    ('Model 3 Long Range', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80', 0),
    ('Model 3 Long Range', 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80', 1),
    ('Hilux SRV 4x4', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80', 0),
    ('Hilux SRV 4x4', 'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=1200&q=80', 1),
    ('CR-V EX-L', 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80', 0),
    ('CR-V EX-L', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80', 1),
    ('Mustang GT Premium', 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80', 0),
    ('Mustang GT Premium', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80', 1),
    ('Santa Fe Calligraphy', 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=1200&q=80', 0),
    ('Santa Fe Calligraphy', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80', 1),
    ('Corolla SE', 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1200&q=80', 0),
    ('Corolla SE', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80', 1),
    ('G 63 AMG', 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80', 0),
    ('G 63 AMG', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', 1)
) AS i(model, url, ord) ON i.model = s.model;
