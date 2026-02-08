from datetime import date, time, datetime
from pydantic import BaseModel

class ProfeBase(BaseModel):
    nombre: str
    disciplina: str

class ProfeCreate(ProfeBase):
    pass

class ProfeUpdate(ProfeBase):
    pass

class ProfeResponse(ProfeBase):
    id: int

    class Config:
        from_attributes = True


class AlumnaBase(BaseModel):
    nombre: str
    edad: int
    dni: int
    seguro_id: int

class AlumnaCreate(AlumnaBase):
    pass

class AlumnaUpdate(AlumnaBase):
    pass

class AlumnaResponse(AlumnaBase):
    id: int

    class Config:
        from_attributes = True




class ClaseBase(BaseModel):
    disciplina: str
    dia: str
    hora: time
    nivel: str
    profe_id: int
    cantidad_alumnas: int

class ClaseCreate(ClaseBase):
    pass

class ClaseUpdate(ClaseBase):
    pass

class ClaseResponse(ClaseBase):
    id: int

    class Config:
        from_attributes = True


class AbonoBase(BaseModel):
    mes: str
    fecha_pago: date


class AbonoCreate(AbonoBase):
    pass

class AbonoUpdate(AbonoBase):
    pass


class AbonoResponse(AbonoBase):
    id: int
    alumna_id: int
    mes: int
    clases_incluidas: int
    clases_usadas: int
    clases_recuperadas: int
    fecha_pago: date

    class Config:
        from_attributes = True

class ReservaClaseBase(BaseModel):
    alumna_id: int
    clase_id: int
    fecha_clase: date


class ReservaClaseCreate(ReservaClaseBase):
    es_recuperacion: bool = False


class ReservaClaseResponse(ReservaClaseBase):
    id: int
    estado: str
    creada_en: datetime
    cancelada_en: datetime | None

    class Config:
        from_attributes = True

class ReservaClaseUpdate(ReservaClaseBase):
    pass


class SeguroBase(BaseModel):
    numero: int
    fecha_vigencia: date
    fecha_pago: date

class SeguroCreate(SeguroBase):
    pass

class SeguroUpdate(SeguroBase):
    pass

class SeguroResponse(SeguroBase):
    id: int

    class Config:
        from_attributes = True