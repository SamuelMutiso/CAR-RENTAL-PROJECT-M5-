"""Add cancellation penalty field and widen notification message

Revision ID: 5e7c2a9f4d18
Revises: 9d4a1f6c8b21
Create Date: 2026-07-31 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5e7c2a9f4d18'
down_revision = '9d4a1f6c8b21'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('cancellation_penalty_percent', sa.Float(), nullable=False, server_default='0'))

    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.alter_column('cancellation_penalty_percent', server_default=None)

    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('message', existing_type=sa.String(length=500), type_=sa.Text(), existing_nullable=False)


def downgrade():
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('message', existing_type=sa.Text(), type_=sa.String(length=500), existing_nullable=False)

    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.drop_column('cancellation_penalty_percent')
