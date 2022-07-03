from turtle import update
from flask import Blueprint, jsonify, request
from app.models import Channel, User, members, Message, db
from flask_login import current_user
from app.forms import CreateChannel
import datetime

channel_routes = Blueprint('channels', __name__ )

@channel_routes.route('/<int:userId>')
def channels(userId):

    channels = Channel.query.join(members).join(User).filter(members.c.users == userId).all()

    return{'channels': [channel.to_dict() for channel in channels]}

@channel_routes.route('/<int:userId>', methods = ['POST'])
def new_channel(userId):

    members = request.json['members']

    form = CreateChannel()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        created_channel = Channel(
            name= form.data["name"],
            owner_id = userId,
            description = form.data["description"],
            private_chat = form.data["private_chat"],
            created_at = datetime.datetime.now(),
            updated_at = datetime.datetime.now()
        )
        for mem in members:
            member = User.query.filter_by(id=mem).first()
            created_channel.channel_members.append(member)

        db.session.add(created_channel)
        db.session.commit()
        return created_channel.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@channel_routes.route('/<int:channelId>', methods = ['PUT'])
def edit_channel(channelId):
    channel = Channel.query.get(channelId)
    updated_channel = request.json

    # adding/removing members
    updated_members = request.json['members']
    updated_remove = request.json['remove']

    name = channel.name
    name = updated_channel['name']
    description = channel.description
    description = updated_channel['description']

    # removing members
    for rem in updated_remove:
        remove = User.query.filter_by(id=rem).first()
        if remove in channel.channel_members:
            channel.channel_members.remove(remove)
        else:
            continue

    # adding members
    for new in updated_members:
        member = User.query.filter_by(id=new).first()
        if member not in channel.channel_members:
            channel.channel_members.append(member)
        else:
            continue

    channel.name = name
    channel.description = description
    db.session.merge(channel)
    db.session.flush()
    db.session.commit()
    return channel.to_dict()

@channel_routes.route('/<int:channelId>', methods= ['DELETE'])
def deleteChannel(channelId):
    channel = Channel.query.get(channelId)
    for message in channel.messages:
        db.session.delete(message)
        db.session.commit() 
    db.session.delete(channel)
    db.session.commit()
    return channel.to_dict()

######################## message feature ###################################
@channel_routes.route('/<int:userId>/<int:channelId>')
def messages(userId, channelId):
    messages = Message.query.filter(Message.channel_id == channelId).all()

    return{'messages': [message.to_dict() for message in messages]}
