from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import datetime, timedelta,date
import calendar
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func


from app.database import engine, Base, get_db
from app import models
from app.models import (
    Profe,
    Alumna,
    Seguro,
    Clase,
    AsistenciaClase,
    Abono,
)
from app.schemas import (
    ProfeCreate, ProfeUpdate, ProfeResponse,
    AlumnaCreate, AlumnaUpdate, AlumnaResponse,
    SeguroCreate, SeguroUpdate, SeguroResponse,
    ClaseCreate, ClaseUpdate, ClaseResponse,
    AsistenciaClaseCreate, AsistenciaClaseResponse, AsistenciaMasivaUpdate, AsistenciaMasivaCreate,
    AbonoCreate, AbonoUpdate, AbonoResponse
)

print("🔥 INICIANDO CUERPOYALMA BACKEND 🔥")

app = FastAPI(title="CuerpoyAlma API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🧱 CREANDO TABLAS...")
Base.metadata.create_all(bind=engine)
print("✅ TABLAS LISTAS")


@app.get("/")
def root():
    return {"app": "cuerpoyalma", "status": "ok"}


# ===================== PROFES =====================

@app.post("/profes", response_model=ProfeResponse)
def crear_profe(profe: ProfeCreate, db: Session = Depends(get_db)):
    nuevo = Profe(**profe.model_dump())
    db.add(nuevo) 
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/profes", response_model=list[ProfeResponse])
def listar_profes(db: Session = Depends(get_db)):
    return db.query(Profe).all()


@app.get("/profes/{profe_id}", response_model=ProfeResponse)
def obtener_profe(profe_id: int, db: Session = Depends(get_db)):
    profe = db.get(Profe,profe_id)
    if not profe:
        raise HTTPException(404, "Profe no encontrado")
    return profe


@app.put("/profes/{profe_id}", response_model=ProfeResponse)
def actualizar_profe(profe_id: int, datos: ProfeUpdate, db: Session = Depends(get_db)):
    profe = db.get(Profe,profe_id)
    if not profe:
        raise HTTPException(404, "Profe no encontrado")

    for k, v in datos.model_dump().items():
        setattr(profe, k, v)

    db.commit()
    db.refresh(profe)
    return profe


@app.delete("/profes/{profe_id}")
def eliminar_profe(profe_id: int, db: Session = Depends(get_db)):
    profe = db.get(Profe,profe_id)
    if not profe:
        raise HTTPException(404, "Profe no encontrado")

    db.delete(profe)
    db.commit()
    return {"detail": "Profe eliminado"}


# ===================== ALUMNAS =====================

@app.post("/alumnas", response_model=AlumnaResponse)
def crear_alumna(alumna: AlumnaCreate, db: Session = Depends(get_db)):
    nueva = Alumna(**alumna.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.get("/alumnas", response_model=list[AlumnaResponse])
def listar_alumnas(db: Session = Depends(get_db)):
    return db.query(Alumna).all()


@app.get("/alumnas/{alumna_id}", response_model=AlumnaResponse)
def obtener_alumna(alumna_id: int, db: Session = Depends(get_db)):
    alumna = db.get(Alumna,alumna_id)
    if not alumna:
        raise HTTPException(404, "Alumna no encontrada")
    return alumna


@app.put("/alumnas/{alumna_id}", response_model=AlumnaResponse)
def actualizar_alumna(alumna_id: int, datos: AlumnaUpdate, db: Session = Depends(get_db)):
    alumna = db.get(Alumna,alumna_id)
    if not alumna:
        raise HTTPException(404, "Alumna no encontrada")

    for k, v in datos.model_dump().items():
        setattr(alumna, k, v)

    db.commit()
    db.refresh(alumna)
    return alumna


@app.delete("/alumnas/{alumna_id}")
def eliminar_alumna(alumna_id: int, db: Session = Depends(get_db)):
    alumna = db.get(Alumna,alumna_id)
    if not alumna:
        raise HTTPException(404, "Alumna no encontrada")

    db.delete(alumna)
    db.commit()
    return {"detail": "Alumna eliminada"}


# ===================== SEGUROS =====================

@app.post("/seguros", response_model=SeguroResponse)
def crear_seguro(seguro: SeguroCreate, db: Session = Depends(get_db)):
    nuevo = Seguro(**seguro.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/seguros", response_model=list[SeguroResponse])
def listar_seguros(db: Session = Depends(get_db)):
    return db.query(Seguro).all()


@app.get("/seguros/{seguro_id}", response_model=SeguroResponse)
def obtener_seguro(seguro_id: int, db: Session = Depends(get_db)):
    seguro = db.get(Seguro,seguro_id)
    if not seguro:
        raise HTTPException(404, "Seguro no encontrado")
    return seguro


@app.put("/seguros/{seguro_id}", response_model=SeguroResponse)
def actualizar_seguro(seguro_id: int, datos: SeguroUpdate, db: Session = Depends(get_db)):
    seguro = db.get(Seguro,seguro_id)
    if not seguro:
        raise HTTPException(404, "Seguro no encontrado")

    for k, v in datos.model_dump().items():
        setattr(seguro, k, v)

    db.commit()
    db.refresh(seguro)
    return seguro


@app.delete("/seguros/{seguro_id}")
def eliminar_seguro(seguro_id: int, db: Session = Depends(get_db)):
    seguro = db.get(Seguro,seguro_id)
    if not seguro:
        raise HTTPException(404, "Seguro no encontrado")

    db.delete(seguro)
    db.commit()
    return {"detail": "Seguro eliminado"}


# ===================== CLASES =====================

@app.post("/clases", response_model=ClaseResponse)
def crear_clase(clase: ClaseCreate, db: Session = Depends(get_db)):
    nueva = Clase(**clase.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.get("/clases", response_model=list[ClaseResponse])
def listar_clases(db: Session = Depends(get_db)):
    return db.query(Clase).all()


@app.get("/clases/{clase_id}", response_model=ClaseResponse)
def obtener_clase(clase_id: int, db: Session = Depends(get_db)):
    clase = db.get(Clase,clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")
    return clase


@app.put("/clases/{clase_id}", response_model=ClaseResponse)
def actualizar_clase(clase_id: int, datos: ClaseUpdate, db: Session = Depends(get_db)):
    clase = db.get(Clase,clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    for k, v in datos.model_dump().items():
        setattr(clase, k, v)

    db.commit()
    db.refresh(clase)
    return clase


@app.delete("/clases/{clase_id}")
def eliminar_clase(clase_id: int, db: Session = Depends(get_db)):
    clase = db.get(Clase,clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    db.delete(clase)
    db.commit()
    return {"detail": "Clase eliminada"}

def clases_usadas(alumna_id, mes, año, db):
    return (
        db.query(AsistenciaClase)
        .filter(
            AsistenciaClase.alumna_id == alumna_id,
            AsistenciaClase.estado.in_(["ACTIVA", "ASISTIO"]),
            extract("month", AsistenciaClase.fecha_clase) == mes,
            extract("year", AsistenciaClase.fecha_clase) == año,
        )
        .count()
    )



# ===================== ASISTENCIAS =====================

@app.post("/asistencias", response_model=AsistenciaClaseResponse)
def crear_asistencia(data: AsistenciaClaseCreate, db: Session = Depends(get_db)):

    # 1️⃣ Validar que tenga abono activo
    abono = obtener_abono_activo(db, data.alumna_id, data.fecha_clase)

    if not abono:
        raise HTTPException(
            status_code=400,
            detail="La alumna no tiene abono activo para esa fecha"
        )

    # 2️⃣ Validar que no exista ya esa asistencia
    existente = db.query(AsistenciaClase).filter(
        AsistenciaClase.alumna_id == data.alumna_id,
        AsistenciaClase.clase_id == data.clase_id,
        AsistenciaClase.fecha_clase == data.fecha_clase
    ).first()

    if existente:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una asistencia para esa clase en esa fecha"
        )

    # 3️⃣ Validar cupo
    validar_cupo(db, data.clase_id, data.fecha_clase)

    # 4️⃣ Crear asistencia (solo registro)
    nueva = AsistenciaClase(
        alumna_id=data.alumna_id,
        clase_id=data.clase_id,
        fecha_clase=data.fecha_clase,
        estado="RESERVADA"
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    return nueva


@app.get("/asistencias", response_model=list[AsistenciaClaseResponse])
def listar_asistencias(db: Session = Depends(get_db)):
    return db.query(AsistenciaClase).all()


@app.delete("/asistencias/{asistencia_id}")
def cancelar_asistencia(asistencia_id: int, db: Session = Depends(get_db)):

    asistencia = db.get(AsistenciaClase, asistencia_id)

    if not asistencia:
        raise HTTPException(
            status_code=404,
            detail="Asistencia no encontrada"
        )

    db.delete(asistencia)
    db.commit()

    return {"detail": "Asistencia cancelada correctamente"}


# ===================== ABONOS =====================

@app.post("/abonos", response_model=AbonoResponse)
def crear_abono(data: AbonoCreate, db: Session = Depends(get_db)):
    try:
        # Convertimos la lista de objetos date a lista de strings ISO (YYYY-MM-DD)
        # Esto es lo que soluciona el error de "not JSON serializable"
        fechas_como_string = [f.isoformat() for f in data.fechas_clase]

        # 1. Crear el registro del Abono
        nuevo_abono = Abono(
            alumna_id=data.alumna_id,
            clase_id=data.clase_id,
            # Guardamos los strings, que sí son serializables a JSON
            fechas_clase=fechas_como_string, 
            mes=data.mes,
            año=data.año,
            fecha_pago=data.fecha_pago,
            estado="PAGO",
            es_recuperacion=data.es_recuperacion,
            clases_incluidas=data.clases_incluidas
        )
        db.add(nuevo_abono)
        
        # 2. Generar asistencias
        # Aquí seguimos usando data.fechas_clase porque AsistenciaClase 
        # sí espera un objeto date en su columna fecha_clase
        for fecha_obj in data.fechas_clase:
            validar_cupo(db, data.clase_id, fecha_obj) 
            
            nueva_asistencia = AsistenciaClase(
                alumna_id=data.alumna_id,
                clase_id=data.clase_id,
                fecha_clase=fecha_obj,
                estado="RESERVADA"
            )
            db.add(nueva_asistencia)
        
        db.commit()
        db.refresh(nuevo_abono)
        return nuevo_abono

    except Exception as e:
        db.rollback()
        print(f"🔥 ERROR CRÍTICO EN ABONO: {str(e)}") 
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@app.get("/abonos", response_model=list[AbonoResponse])
def listar_abonos(db: Session = Depends(get_db)):
    return db.query(Abono).all()


@app.get("/abonos/alumna/{alumna_id}", response_model=list[AbonoResponse])
def listar_abonos_por_alumna(alumna_id: int, db: Session = Depends(get_db)):
    return db.query(Abono).filter(
        Abono.alumna_id == alumna_id
    ).all()


@app.get("/abonos/activo/{alumna_id}", response_model=AbonoResponse)
def obtener_abono_activo_endpoint(alumna_id: int, db: Session = Depends(get_db)):

    hoy = date.today()

    abono = db.query(Abono).filter(
        Abono.alumna_id == alumna_id,
        Abono.estado == "RESERVADA",
        Abono.fecha_inicio <= hoy,
        Abono.fecha_fin >= hoy
    ).first()

    if not abono:
        raise HTTPException(
            status_code=404,
            detail="No tiene abono activo"
        )

    return abono

@app.get("/abonos/disponibilidad/{alumna_id}")
def disponibilidad_abono(alumna_id: int, db: Session = Depends(get_db)):

    hoy = date.today()

    abono = obtener_abono_activo(db, alumna_id, hoy)

    if not abono:
        raise HTTPException(404, "No tiene abono activo")

    usadas = db.query(Abono).filter(
        Abono.alumna_id == alumna_id,
        Abono.fecha_inicio <= hoy,
        Abono.fecha_clase <= abono.fecha_fin,
        Abono.estado == "RESERVADA"
    ).count()

    disponibles = abono.clases_incluidas - usadas

    return {
        "clases_incluidas": abono.clases_incluidas,
        "clases_usadas": usadas,
        "clases_disponibles": disponibles
    }


# ================================RESUMEN ABONO==========================================
@app.get("/abonos/resumen/{alumna_id}")
def resumen_abono(alumna_id: int, mes: int, año: int, db: Session = Depends(get_db)):

    abono = (
        db.query(Abono)
        .filter(
            Abono.alumna_id == alumna_id,
            Abono.mes == mes,
            Abono.año == año
        )
        .first()
    )

    if not abono:
        raise HTTPException(404, "No existe abono para ese mes")

    usadas = clases_usadas_mes(db, alumna_id, mes, año)

    total_habilitadas = (
        abono.clases_incluidas +
        abono.clases_recuperadas
    )

    disponibles = total_habilitadas - usadas

    return {
        "alumna_id": alumna_id,
        "mes": mes,
        "año": año,
        "total_habilitadas": total_habilitadas,
        "usadas": usadas,
        "disponibles": max(disponibles, 0)
    }


# ================================REVISIÓN DÍAS DEL MES==========================================

def fechas_del_mes_por_dia(año, mes, nombre_dia_español):
    # Mapeo de nombres que vienen del front a números de Python (Monday=0)
    dias_map = {
        "Lunes": 0, "Martes": 1, "Miércoles": 2, "Jueves": 3,
        "Viernes": 4, "Sábado": 5, "Domingo": 6
    }
    target_day = dias_map.get(nombre_dia_español)
    
    fechas = []
    _, ultimo_dia = calendar.monthrange(año, mes)

    for dia_mes in range(1, ultimo_dia + 1):
        fecha = date(año, mes, dia_mes)
        if fecha.weekday() == target_day:
            fechas.append(fecha)
    return fechas

@app.get("/clases/{clase_id}/fechas")
def obtener_fechas_clase(clase_id: int, mes: int, año: int, db: Session = Depends(get_db)):
    clase = db.get(Clase, clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    # Usamos clase.dia (ej: "Lunes") para calcular
    fechas = fechas_del_mes_por_dia(año, mes, clase.dia)
    return {"fechas": [f.isoformat() for f in fechas]}

# ================================RESUMEN MENSUAL==========================================
from sqlalchemy import func
from datetime import date

@app.get("/resumen-mensual")
def resumen_mensual(mes: int, año: int, db: Session = Depends(get_db)):

    # 1️⃣ Alumnas con abono activo ese mes
    alumnas_activas = (
        db.query(Abono)
        .filter(
            Abono.mes == mes,
            Abono.año == año
        )
        .count()
    )

    # 2️⃣ Total asistencias activas del mes
    asistencias_totales = (
        db.query(AsistenciaClase)
        .filter(
            func.extract("month", AsistenciaClase.fecha_clase) == mes,
            func.extract("year", AsistenciaClase.fecha_clase) == año,
            AsistenciaClase.estado == "ACTIVA"
        )
        .count()
    )

    # 3️⃣ Clases usadas (ASISTIO)
    clases_usadas = (
        db.query(AsistenciaClase)
        .filter(
            func.extract("month", AsistenciaClase.fecha_clase) == mes,
            func.extract("year", AsistenciaClase.fecha_clase) == año,
            AsistenciaClase.estado == "ASISTIO"
        )
        .count()
    )

    return {
        "mes": mes,
        "año": año,
        "alumnas_activas": alumnas_activas,
        "asistencias_totales": asistencias_totales,
        "clases_usadas": clases_usadas
    }

# ===================== PASE DE LISTA MASIVO =====================

@app.put("/asistencias/actualizar-masivo")
def actualizar_asistencias_masivo(data: AsistenciaMasivaUpdate, db: Session = Depends(get_db)):
    # data contiene: clase_id, fecha y lista de ids de alumnas que SI vinieron

    # 1. Obtenemos todas las asistencias generadas previamente para esa clase y fecha
    asistencias_planificadas = (
        db.query(AsistenciaClase)
        .filter(
            AsistenciaClase.clase_id == data.clase_id,
            AsistenciaClase.fecha_clase == data.fecha
        )
        .all()
    )

    if not asistencias_planificadas:
        raise HTTPException(404, "No hay lista de espera/abonos cargados para esta clase hoy")

    actualizadas = 0
    for registro in asistencias_planificadas:
        # Si el ID de la alumna está en la lista de presentes que mandó el front
        if registro.alumna_id in data.alumnas_presentes:
            registro.estado = "ASISTIO"
        else:
            registro.estado = "FALTO"
        actualizadas += 1

    db.commit()
    return {
        "detail": "Pase de lista completado",
        "alumnas_procesadas": actualizadas
    }

# ===================== LISTA FILTRADA PARA EL FRONTEND =====================

@app.get("/asistencias/clase-dia")
def obtener_lista_asistencia_frontend(clase_id: int, fecha: date, db: Session = Depends(get_db)):
    """
    Este endpoint es el que usará Asistencias.jsx para mostrar el listado
    de alumnas que DEBERÍAN estar hoy en clase.
    """
    asistencias = (
        db.query(AsistenciaClase)
        .filter(
            AsistenciaClase.clase_id == clase_id,
            AsistenciaClase.fecha_clase == fecha
        )
        .all()
    )

    return [
        {
            "alumna_id": a.alumna.id,
            "nombre": a.alumna.nombre,
            "apellido": a.alumna.apellido,
            "estado_actual": a.estado,
            "seguro_al_dia": a.alumna.seguros[-1].vencimiento > date.today() if a.alumna.seguros else False
        }
        for a in asistencias
    ]

# ===================== LISTA CLASE DEL DÍA =====================

@app.get("/asistencias/clase")
def obtener_lista_clase(clase_id: int, fecha: date, db: Session = Depends(get_db)):

    asistencias = (
        db.query(AsistenciaClase)
        .filter(
            AsistenciaClase.clase_id == clase_id,
            AsistenciaClase.fecha_clase == fecha
        )
        .all()
    )

    resultado = []

    for a in asistencias:
        resultado.append({
            "asistencia_id": a.id,
            "alumna_id": a.alumna_id,
            "nombre": a.alumna.nombre,
            "estado": a.estado
        })

    return resultado

# ================================CUPOS DE CLASES==========================================

@app.get("/abonos/cupo")
def obtener_cupo(clase_id: int, fecha: date, db: Session = Depends(get_db)):
    clase = db.get(Clase, clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    # Calculamos las asistencias reales
    asistencias_totales = db.query(AsistenciaClase).filter(
        AsistenciaClase.clase_id == clase_id,
        AsistenciaClase.fecha_clase == fecha
    ).count()

    disponibles = clase.cantidad_alumnas - asistencias_totales

    return {
        "cupo_total": clase.cantidad_alumnas,
        "asistencias": asistencias_totales,
        "disponibles": max(disponibles, 0)
    }

# ===================== FUNCIONES DE NEGOCIO =====================

def obtener_abono_activo(db: Session, alumna_id: int, fecha: date):
    return (
        db.query(Abono)
        .filter(
            Abono.alumna_id == alumna_id,
            Abono.mes == fecha.month,
            Abono.año == fecha.year
        )
        .with_for_update()
        .first()
    )


def clases_usadas_mes(db: Session, alumna_id: int, mes: int, año: int):
    return (
        db.query(AsistenciaClase)
        .filter(
            AsistenciaClase.alumna_id == alumna_id,
            extract("month", AsistenciaClase.fecha_clase) == mes,
            extract("year", AsistenciaClase.fecha_clase) == año,
        )
        .count()
    )


def validar_cupo(db: Session, clase_id: int, fecha: date):
    clase = db.get(Clase, clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    ocupadas = (
        db.query(AsistenciaClase)
        .filter(
            AsistenciaClase.clase_id == clase_id,
            AsistenciaClase.fecha_clase == fecha,
        )
        .count()
    )

    if ocupadas >= clase.cantidad_alumnas:
        raise HTTPException(400, "La clase ya está completa")