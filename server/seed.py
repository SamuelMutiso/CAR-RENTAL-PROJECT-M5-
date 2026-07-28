from app import create_app
from extensions import db, bcrypt
from models import User, Vehicle, Feature, Driver
app = create_app()
KENYAN_CITIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']
FEATURE_DATA = [('GPS', 'gps', 'Built-in satellite navigation'), ('Bluetooth', 'bluetooth', 'Hands-free calling and audio streaming'), ('AWD', 'awd', 'All-wheel drive for better traction'), ('Heated Seats', 'heated_seats', 'Front seat heating'), ('Backup Camera', 'backup_camera', 'Rear-view parking camera'), ('Apple CarPlay', 'apple_carplay', 'iPhone integration on the dashboard'), ('Sunroof', 'sunroof', 'Retractable sunroof'), ('4WD', '4wd', 'Four-wheel drive for off-road capability'), ('USB Charging', 'usb_charging', 'Multiple USB charging ports'), ('Leather Seats', 'leather_seats', 'Premium leather upholstery')]

def _commons(filename, width=800):
    return f'https://commons.wikimedia.org/wiki/Special:FilePath/{filename}?width={width}'
MODEL_CATALOG = [('Lincoln', 'Town Car Limousine', 'Limousine', 25000, 'Lincoln_Town_Car_Limousine.jpg', 'Petrol', 'Automatic', 'RWD'), ('Rolls-Royce', 'Funeral Hearse', 'Hearse', 20000, 'Rolls_Royce_Funeral_Hearse_(1).jpg', 'Petrol', 'Automatic', 'RWD'), ('Toyota', 'RAV4', 'SUV', 4500, 'Toyota_RAV4_002.JPG', 'Petrol', 'Automatic', 'AWD'), ('Nissan', 'X-Trail', 'SUV', 4200, 'Nissan_X-Trail_(T33)_1X7A7179.jpg', 'Petrol', 'Automatic', 'AWD'), ('Subaru', 'Forester', 'SUV', 5000, '2022_Subaru_Forester_Wilderness.jpg', 'Petrol', 'Automatic', 'AWD'), ('Honda', 'CR-V', 'SUV', 4300, 'Honda_CR-V_(6th_generation)_hybrid_DSC_7919.jpg', 'Hybrid', 'Automatic', 'AWD'), ('Land Rover', 'Range Rover', 'SUV', 15000, 'Land_Rover_Range_Rover_P525_Autobiography_L405_black_(4).jpg', 'Diesel', 'Automatic', '4WD'), ('Mercedes-Benz', 'C-Class', 'Sedan', 7500, 'Mercedes-Benz_C-Class_W205_FL_silver_(2).jpg', 'Petrol', 'Automatic', 'RWD'), ('Volkswagen', 'Golf', 'Sedan', 3200, 'Volkswagen_Golf_VII_GTI.JPG', 'Petrol', 'Manual', 'FWD'), ('Toyota', 'Corolla', 'Sedan', 2800, '2020_Toyota_Corolla_SE.jpg', 'Petrol', 'Automatic', 'FWD'), ('Mazda', 'Demio', 'Sedan', 2200, 'Mazda_Demio_DE_13-SKYACTIV.JPG', 'Petrol', 'Manual', 'FWD'), ('Toyota', 'Hilux', 'Truck', 6000, 'Toyota_Hilux_J_4x4_2021.jpg', 'Diesel', 'Manual', '4WD'), ('Ford', 'Ranger', 'Truck', 6200, 'Ford_Ranger.JPG', 'Diesel', 'Automatic', '4WD'), ('Isuzu', 'D-Max', 'Truck', 5800, 'Isuzu_D-Max_4x4_Rodeo_2021.jpg', 'Diesel', 'Manual', '4WD'), ('Toyota', 'Hiace', 'Van', 5500, '2007_Toyota_Hiace_Van_LWB_KLH22.jpg', 'Diesel', 'Manual', 'RWD'), ('Nissan', 'Urvan', 'Van', 5300, 'Nissan_NV350_Urvan_2.5_Premium_2020_(1).jpg', 'Diesel', 'Manual', 'RWD'), ('BMW', '4 Series', 'Convertible', 8500, 'BMW_4_Series.jpg', 'Petrol', 'Automatic', 'RWD'), ('Porsche', '911', 'Convertible', 18000, 'Porsche_911_Turbo.jpg', 'Petrol', 'Automatic', 'AWD'), ('Bentley', 'Continental GT', 'Convertible', 22000, 'Bentley_Continental_GT_(front).jpg', 'Petrol', 'Automatic', 'AWD'), ('Toyota', 'Land Cruiser 70', 'Safari', 8000, 'Toyota_Land_Cruiser_Prado_70_002.JPG', 'Diesel', 'Manual', '4WD'), ('Toyota', 'Land Cruiser Prado', 'Safari', 11000, 'Toyota_Land_Cruiser_Prado_120_003.JPG', 'Diesel', 'Automatic', '4WD'), ('Toyota', 'Land Cruiser 200', 'Safari', 16000, 'Toyota_Land_Cruiser_200_002.JPG', 'Diesel', 'Automatic', '4WD'), ('Toyota', 'Coaster Shuttle', 'Bus', 9000, 'Toyota_Coaster_012.JPG', 'Diesel', 'Manual', 'RWD'), ('Toyota', 'Coaster', 'Bus', 12000, 'Toyota_Coaster_Mini_Bus_2015.jpg', 'Diesel', 'Manual', 'RWD'), ('Scania', 'Touring Coach', 'Bus', 20000, 'KAUTRA_Scania_Touring_bus_in_Bergen.jpg', 'Diesel', 'Manual', 'RWD')]
EXTERIOR_COLORS = ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Beige']
DESCRIPTION_TEMPLATES = {'SUV': 'This {year} {make} {model} blends commanding road presence with everyday comfort - spacious seating, confident handling on Kenyan highways, and enough boot space for a family getaway to the coast.', 'Sedan': 'A fuel-efficient {year} {make} {model} built for the daily commute - smooth on tarmac, easy to park in the city, and kind on your wallet at the pump.', 'Truck': 'Built to work as hard as you do. This {year} {make} {model} handles rough murram roads, cargo runs, and weekend off-road trips without breaking a sweat.', 'Van': 'Room for the whole crew - this {year} {make} {model} seats up to 14 comfortably, ideal for airport transfers, group trips, and moving day.', 'Convertible': 'Turn heads on every drive. This {year} {make} {model} pairs head-turning style with a driving experience reserved for special occasions.', 'Limousine': "Make the entrance unforgettable. This {year} {make} {model} is GearShift's most-booked wedding car - roomy, immaculately presented, and available as part of a full convoy for your bridal party.", 'Hearse': 'A dignified, respectfully maintained {year} {make} {model} for funeral processions. Available with an experienced chauffeur, and at a reduced rate when booked as part of a funeral convoy.', 'Safari': 'Built for the bush. This {year} {make} {model} handles game park tracks with ease and gives everyone a clear view of the action - book with one of our experienced safari drivers or take the wheel yourself.', 'Bus': 'Keep the whole group together. This {year} {make} {model} is ideal for school trips, staff transport, or moving a large tour group between destinations in comfort.'}
DESCRIPTION_OVERRIDES = {'Range Rover': 'Arrive in complete command. The {year} {make} {model} pairs a commanding driving position with a cabin finished to a five-star standard - our most requested SUV for executive travel and airport transfers.', 'Porsche 911': "An icon, available by the day. The {year} {make} {model} delivers razor-sharp handling and a soundtrack to match - book it for the drive you'll talk about for years.", 'Continental GT': 'Handcrafted luxury on four wheels. The {year} {make} {model} is the ultimate way to make an entrance at a wedding, gala, or milestone celebration.'}
DRIVER_DATA = [('Grace Wanjiru', 5.0, 6000, '+254712000001', 'DL-D10001', '20 years chauffeuring diplomats and wedding parties.', 'driver1@gearshift.com'), ('James Mwangi', 4.9, 5800, '+254712000002', 'DL-D10002', 'Former corporate driver, specialises in executive transfers.', 'driver2@gearshift.com'), ('Samuel Kimani', 4.8, 5400, '+254712000003', 'DL-D10003', 'Calm, punctual, and great with long upcountry drives.', 'driver3@gearshift.com'), ('Faith Achieng', 4.6, 4400, '+254712000004', 'DL-D10004', 'Popular for wedding convoys - always early, always sharp.', 'driver4@gearshift.com'), ('Mercy Nyambura', 4.4, 3800, '+254712000005', 'DL-D10005', 'Five years experience, fluent in English, Swahili and French.', 'driver5@gearshift.com'), ('Peter Otieno', 4.2, 3200, '+254712000006', 'DL-D10006', 'Reliable city driver, knows Nairobi traffic patterns well.', 'driver6@gearshift.com'), ('Ann Wairimu', 4.1, 3000, '+254712000007', 'DL-D10007', 'Friendly and safety-conscious, good with airport runs.', 'driver7@gearshift.com'), ('Daniel Kiptoo', 3.9, 2600, '+254712000008', 'DL-D10008', 'New to GearShift, comes highly recommended by past clients.', 'driver8@gearshift.com')]
DRIVER_PASSWORD = 'driver123'

def build_fleet(target_size=50):
    fleet = []
    i = 0
    while len(fleet) < target_size:
        (make, model, category, base_rate, filename, fuel_type, transmission, drive) = MODEL_CATALOG[i % len(MODEL_CATALOG)]
        repeat_index = i // len(MODEL_CATALOG)
        year = 2024 - repeat_index - i % 4
        rate = base_rate + repeat_index * 150 - i % 3 * 100
        template = DESCRIPTION_OVERRIDES.get(model, DESCRIPTION_TEMPLATES[category])
        description = template.format(year=year, make=make, model=model)
        if i % 6 == 0:
            condition = 'New'
            mileage = i * 137 % 3000
        else:
            condition = 'Used'
            mileage = max(1, 2025 - year) * 9000 + i * 173 % 4000
        fleet.append({'make': make, 'model': model, 'category': category, 'year': year, 'daily_rate': max(rate, 1500), 'location': KENYAN_CITIES[i % len(KENYAN_CITIES)], 'image_url': _commons(filename), 'description': description, 'condition': condition, 'mileage': mileage, 'fuel_type': fuel_type, 'transmission': transmission, 'drive': drive, 'exterior_color': EXTERIOR_COLORS[i % len(EXTERIOR_COLORS)]})
        i += 1
    return fleet[:target_size]

def run():
    with app.app_context():
        print('Dropping all tables...')
        db.drop_all()
        print('Creating all tables...')
        db.create_all()
        print('Seeding users...')
        admin = User(email='admin@gearshift.com', password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8'), role='admin', verification_status='verified')
        owner = User(email='owner@gearshift.com', password_hash=bcrypt.generate_password_hash('owner123').decode('utf-8'), role='client', rental_intent='owner', license_number='DL-OWN001', verification_status='verified')
        client1 = User(email='client1@gearshift.com', password_hash=bcrypt.generate_password_hash('client123').decode('utf-8'), role='client', rental_intent='renter', license_number='DL-100234', verification_status='verified')
        client2 = User(email='client2@gearshift.com', password_hash=bcrypt.generate_password_hash('client123').decode('utf-8'), role='client', rental_intent='renter', license_number='DL-100999', verification_status='unverified')
        client3 = User(email='client3@gearshift.com', password_hash=bcrypt.generate_password_hash('client123').decode('utf-8'), role='client', rental_intent='renter', license_number='DL-101555', verification_status='verified')
        db.session.add_all([admin, owner, client1, client2, client3])
        db.session.commit()
        print('Seeding features...')
        features = []
        for (name, icon, description) in FEATURE_DATA:
            f = Feature(name=name, icon=icon, description=description, category='comfort')
            features.append(f)
        db.session.add_all(features)
        db.session.commit()
        print('Seeding drivers...')
        drivers = []
        driver_password_hash = bcrypt.generate_password_hash(DRIVER_PASSWORD).decode('utf-8')
        for (name, rating, daily_rate, phone, license_number, bio, email) in DRIVER_DATA:
            drivers.append(Driver(name=name, rating=rating, daily_rate=daily_rate, phone=phone, license_number=license_number, bio=bio, email=email, password_hash=driver_password_hash))
        db.session.add_all(drivers)
        db.session.commit()
        print('Seeding vehicles...')
        owners = [owner]
        fleet = build_fleet(target_size=50)
        for (i, data) in enumerate(fleet):
            vehicle = Vehicle(make=data['make'], model=data['model'], year=data['year'], daily_rate=data['daily_rate'], location=data['location'], category=data['category'], image_url=data['image_url'], description=data['description'], condition=data['condition'], mileage=data['mileage'], fuel_type=data['fuel_type'], transmission=data['transmission'], drive=data['drive'], exterior_color=data['exterior_color'], owner_id=owners[i % len(owners)].id, is_approved=True, is_available=True)
            start = i % len(features)
            count = 3 + i % 3
            picked = [features[(start + j) % len(features)] for j in range(count)]
            vehicle.features = picked
            db.session.add(vehicle)
        db.session.commit()
        print(f'Done! Seeded 5 users, {len(features)} features, {len(drivers)} drivers, {len(fleet)} vehicles.')
        print('See README.md for the full list of demo logins (admin, owner, 3 clients, 8 drivers).')
if __name__ == '__main__':
    run()