"""Add user username

Revision ID: 9d4a1f6c8b21
Revises: 2b6e9f10a3c7
Create Date: 2026-07-31 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9d4a1f6c8b21'
down_revision = '2b6e9f10a3c7'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=30), nullable=True))
        batch_op.create_unique_constraint('uq_users_username', ['username'])


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('uq_users_username', type_='unique')
        batch_op.drop_column('username')
