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
    alumna_id: int
    mes: int
    año: int
    fecha_pago: date
    cancelada_en: datetime | None
    es_recuperacion: bool = False
    estado: str

class AbonoCreate(AbonoBase):
    pass

class AbonoUpdate(BaseModel):
    alumna_id: int | None = None
    mes: int | None = None
    fecha_pago: date | None = None



class AbonoResponse(BaseModel):
    id: int
    alumna_id: int
    mes: int
    año: int
    fecha_pago: date
    cancelada_en: datetime | None
    es_recuperacion: bool = False
    estado: str

    class Config:
        from_attributes = True


class AsistenciaClaseBase(BaseModel):
    alumna_id: int
    clase_id: int
    fecha_clase: date


class AsistenciaClaseCreate(AsistenciaClaseBase):
    pass


class AsistenciaClaseResponse(AsistenciaClaseBase):
    id: int
    estado: str
    creada_en: datetime

    class Config:
        from_attributes = True

class AsistenciaClaseUpdate(AsistenciaClaseBase):
    pass

class AsistenciaMasivaCreate(AsistenciaClaseBase):
    pass

class AsistenciaMasivaUpdate(BaseModel):
    clase_id: int
    fecha: date
    alumnas_presentes: list[int]

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