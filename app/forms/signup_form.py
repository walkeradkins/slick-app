from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


# def username_exists(form, field):
#     # Checking if username is already in use
#     username = field.data
#     user = User.query.filter(User.username == username).first()
#     if user:
#         raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    first_name = StringField('first name', validators=[DataRequired()])
    last_name = StringField('last name', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), user_exists])
    profile_img = StringField('profile image')
    password = StringField('password', validators=[DataRequired()])

class MessageForm(FlaskForm):
    content = StringField('content', validators=[DataRequired()])
    owner_id = IntegerField('owner_id', validators=[DataRequired()])
    channel_id = IntegerField('channel_id', validators=[DataRequired()])
    created_at = StringField('created_at', validators=[DataRequired()])
    updated_at = StringField('updated_at', validators=[DataRequired()])
