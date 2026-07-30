"""Add booking payment fields

Revision ID: 7f3a9c2e1d44
Revises: 05c0b5bb8ef2
Create Date: 2026-07-30 22:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7f3a9c2e1d44'
down_revision = '05c0b5bb8ef2'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('payment_method', sa.String(length=20), nullable=False, server_default='mpesa'))
        batch_op.add_column(sa.Column('payment_status', sa.String(length=20), nullable=False, server_default='pending'))
        batch_op.add_column(sa.Column('mpesa_phone', sa.String(length=20), nullable=True))

    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.alter_column('payment_method', server_default=None)
        batch_op.alter_column('payment_status', server_default=None)


def downgrade():
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.drop_column('mpesa_phone')
        batch_op.drop_column('payment_status')
        batch_op.drop_column('payment_method')
