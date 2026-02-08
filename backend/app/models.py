from sqlalchemy import (
    Column, Integer, String, Date, Time,
    ForeignKey, DateTime, Boolean, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


# ---------- SEGURO ----------
class Seguro(Base):
    __tablename__ = "seguro"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(Integer, index=True)
    fecha_vigencia = Column(Date, nullable=False)
    fecha_pago = Column(Date, nullable=False)


# ---------- PROFES ----------
class Profe(Base):
    __tablename__ = "profes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    disciplina = Column(String, nullable=False)


# ---------- ALUMNAS ----------
class Alumna(Base):
    __tablename__ = "alumnas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    edad = Column(Integer, nullable=False)
    dni = Column(Integer, unique=True, nullable=False)
    seguro_id = Column(Integer, ForeignKey("seguro.id"), nullable=False)

    abonos = relationship(
        "Abono",
        back_populates="alumna",
        cascade="all, delete-orphan"
    )

    reservas = relationship(
        "ReservaClase",
        back_populates="alumna",
        cascade="all, delete-orphan"
    )


# ---------- CLASES ----------
class Clase(Base):
    __tablename__ = "clases"

    id = Column(Integer, primary_key=True, index=True)
    disciplina = Column(String, nullable=False)
    dia = Column(String, nullable=False)
    hora = Column(Time, nullable=False)
    nivel = Column(String)

    profe_id = Column(Integer, ForeignKey("profes.id"), nullable=False)
    cantidad_alumnas = Column(Integer, default=0)

    reservas = relationship(
        "ReservaClase",
        back_populates="clase",
        cascade="all, delete-orphan"
    )


# ---------- ABONOS ----------
class Abono(Base):
    __tablename__ = "abonos"

    id = Column(Integer, primary_key=True, index=True)
    alumna_id = Column(Integer, ForeignKey("alumnas.id"), nullable=False)

    mes = Column(Integer, nullable=False)  # ej: "2026-01"
    clases_incluidas = Column(Integer, default=8)
    clases_usadas = Column(Integer, default=0)
    clases_recuperadas = Column(Integer, default=0)

    fecha_pago = Column(Date, nullable=False)

    alumna = relationship("Alumna", back_populates="abonos")


# ---------- RESERVAS ----------
class ReservaClase(Base):
    __tablename__ = "reservas_clase"

    id = Column(Integer, primary_key=True, index=True)

    alumna_id = Column(Integer, ForeignKey("alumnas.id"), nullable=False)
    clase_id = Column(Integer, ForeignKey("clases.id"), nullable=False)

    fecha_clase = Column(Date, nullable=False)

    estado = Column(
        String,
        nullable=False,
        default="RESERVADA"
        # RESERVADA | CANCELADA_A_TIEMPO | ASISTIO | NO_ASISTIO | RECUPERADA
    )

    creada_en = Column(DateTime, default=datetime.utcnow)
    cancelada_en = Column(DateTime, nullable=True)

    es_recuperacion = Column(Boolean, default=False)

    alumna = relationship("Alumna", back_populates="reservas")
    clase = relationship("Clase", back_populates="reservas")

    __table_args__ = (
        UniqueConstraint(
            "alumna_id",
            "clase_id",
            "fecha_clase",
            name="uq_reserva_alumna_clase_fecha"
        ),
    )
