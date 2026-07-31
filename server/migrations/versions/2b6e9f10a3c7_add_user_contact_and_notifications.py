"""Add user name/phone and notifications table

Revision ID: 2b6e9f10a3c7
Revises: 7f3a9c2e1d44
Create Date: 2026-07-31 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b6e9f10a3c7'
down_revision = '7f3a9c2e1d44'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('phone', sa.String(length=20), nullable=True))

    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=30), nullable=False, server_default='general'),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('message', sa.String(length=500), nullable=False),
        sa.Column('booking_id', sa.Integer(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('simulated_email_sent', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('simulated_sms_sent', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )

    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('type', server_default=None)
        batch_op.alter_column('is_read', server_default=None)
        batch_op.alter_column('simulated_email_sent', server_default=None)
        batch_op.alter_column('simulated_sms_sent', server_default=None)


def downgrade():
    op.drop_table('notifications')
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('phone')
        batch_op.drop_column('name')
