from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import cloudinary
import os
import urllib.parse

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

app = Flask(__name__)

# PostgreSQL Configuration
def get_database_url():
    # Try to get the database URL from environment
    db_url = os.getenv('DATABASE_URL')
    
    # If not found, fall back to SQLite
    if not db_url:
        return 'sqlite:///students.db'
    
    # Modify Postgres URL to work with SQLAlchemy
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    
    return db_url

# Set up database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')

# Initialize database
db = SQLAlchemy(app)

# Define Student Model
class Student(db.Model):
    __tablename__ = 'students'  # Explicitly set table name
    
    id = db.Column(db.Integer, primary_key=True)
    roll_number = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    institute = db.Column(db.String(100), nullable=False)
    stream = db.Column(db.String(50), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    video_url = db.Column(db.String(255))
    selfie_url = db.Column(db.String(255))

# Database initialization with error handling
def init_db():
    try:
        with app.app_context():
            # Drop all existing tables (uncomment only for testing)
            # db.drop_all()
            
            # Create all tables
            db.create_all()
            print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

# Initialize database before first request
@app.before_first_request
def create_tables():
    init_db()

@app.route('/', methods=['GET', 'POST'])
def student_dashboard():
    if request.method == 'POST':
        # Handle form submission
        roll_number = request.form['roll_number']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        institute = request.form['institute']
        stream = request.form['stream']
        year = request.form['year']
        email = request.form['email']
        phone_number = request.form['phone_number']
        
        # Handle video upload
        video_file = request.files.get('video')
        if video_file:
            video_upload = upload(video_file, resource_type="video")
            video_url = video_upload['secure_url']
        else:
            video_url = None
        
        # Handle selfie upload
        selfie_file = request.files.get('selfie')
        if selfie_file:
            selfie_upload = upload(selfie_file, resource_type="image")
            selfie_url = selfie_upload['secure_url']
        else:
            selfie_url = None
        
        # Create or update student record
        student = Student.query.filter_by(roll_number=roll_number).first()
        if not student:
            student = Student(
                roll_number=roll_number,
                first_name=first_name,
                last_name=last_name,
                institute=institute,
                stream=stream,
                year=year,
                email=email,
                phone_number=phone_number,
                video_url=video_url,
                selfie_url=selfie_url
            )
            db.session.add(student)
        else:
            # Update existing student record
            student.first_name = first_name
            student.last_name = last_name
            student.institute = institute
            student.stream = stream
            student.year = year
            student.email = email
            student.phone_number = phone_number
            student.video_url = video_url
            student.selfie_url = selfie_url
        
        db.session.commit()
        return redirect(url_for('student_dashboard'))
    
    return render_template('index.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
