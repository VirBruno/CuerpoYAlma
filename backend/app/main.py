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
    ReservaClase,
    Abono,
)
from app.schemas import (
    ProfeCreate, ProfeUpdate, ProfeResponse,
    AlumnaCreate, AlumnaUpdate, AlumnaResponse,
    SeguroCreate, SeguroUpdate, SeguroResponse,
    ClaseCreate, ClaseUpdate, ClaseResponse,
    ReservaClaseCreate, ReservaClaseResponse, ReservaClaseUpdate, ReservaMasivaCreate,
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
        db.query(ReservaClase)
        .filter(
            ReservaClase.alumna_id == alumna_id,
            ReservaClase.estado.in_(["ACTIVA", "ASISTIO"]),
            extract("month", ReservaClase.fecha_clase) == mes,
            extract("year", ReservaClase.fecha_clase) == año,
        )
        .count()
    )


# ===================== RESERVAS =====================

@app.post("/reservas", response_model=ReservaClaseResponse)
def reservar_clase(reserva: ReservaClaseCreate, db: Session = Depends(get_db)):

    clase = db.get(Clase, reserva.clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    # Validar abono
    mes = reserva.fecha_clase.month
    año = reserva.fecha_clase.year

    abono = db.query(Abono).filter(
        Abono.alumna_id == reserva.alumna_id,
        Abono.mes == mes,
        Abono.año == año
    ).first()

    if not abono:
        raise HTTPException(400, "La alumna no tiene abono activo para ese mes")

    usadas = clases_usadas(reserva.alumna_id, mes, año, db)

    disponibles = (
        abono.clases_incluidas +
        abono.clases_recuperadas -
        usadas
    )

    if disponibles <= 0:
        raise HTTPException(400, "No tiene clases disponibles en el abono")

    # Validar cupo
    cupo = (
        db.query(ReservaClase)
        .filter(
            ReservaClase.clase_id == reserva.clase_id,
            ReservaClase.fecha_clase == reserva.fecha_clase,
            ReservaClase.estado == "ACTIVA",
        )
        .count()
    )

    if cupo >= clase.cantidad_alumnas:
        raise HTTPException(400, "La clase ya está completa")

    nueva = ReservaClase(
        alumna_id=reserva.alumna_id,
        clase_id=reserva.clase_id,
        fecha_clase=reserva.fecha_clase,
        es_recuperacion=reserva.es_recuperacion,
        estado="ACTIVA",
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.post("/reservas/masiva")
def reservar_masiva(data: ReservaMasivaCreate, db: Session = Depends(get_db)):

    reservas_creadas = []

    abono = (
    db.query(Abono)
    .filter(
        Abono.alumna_id == data.alumna_id,
        Abono.mes == data.mes,
        Abono.año == data.año
    )
    .with_for_update()
    .first()
    )   

    if not abono:
        raise HTTPException(400, "La alumna no tiene abono activo para ese mes")

    for clase_id in data.clase_ids:

        clase = db.get(Clase, clase_id)
        if not clase:
            continue

        fechas = fechas_del_mes_por_dia(
            data.año,
            data.mes,
            clase.dia_semana
        )

        for fecha in fechas:

            # Evitar duplicados
            existe = db.query(ReservaClase).filter(
                ReservaClase.alumna_id == data.alumna_id,
                ReservaClase.clase_id == clase_id,
                ReservaClase.fecha_clase == fecha
            ).first()

            if existe:
                continue

            # Validar cupo
            cupo = (
                db.query(ReservaClase)
                .filter(
                    ReservaClase.clase_id == clase_id,
                    ReservaClase.fecha_clase == fecha,
                    ReservaClase.estado == "ACTIVA",
                )
                .count()
            )

            if cupo >= clase.cantidad_alumnas:
                continue

            usadas_actuales = clases_usadas(data.alumna_id, data.mes, data.año, db)
            usadas_actuales += len(reservas_creadas)

            disponibles = (
                abono.clases_incluidas +
                abono.clases_recuperadas -
                usadas_actuales
            )

            if disponibles <= 0:
                break

            nueva = ReservaClase(
                alumna_id=data.alumna_id,
                clase_id=clase_id,
                fecha_clase=fecha,
                es_recuperacion=data.es_recuperacion,
                estado="ACTIVA",
            )

            db.add(nueva)
            reservas_creadas.append(nueva)

    db.commit()

    return {
        "mensaje": "Reservas generadas",
        "cantidad": len(reservas_creadas)
    }

@app.get("/reservas", response_model=list[ReservaClaseResponse])
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(ReservaClase).all()


@app.put("/reservas/{reserva_id}/cancelar")
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)):

    reserva = db.get(ReservaClase, reserva_id)
    if not reserva:
        raise HTTPException(404, "Reserva no encontrada")

    if reserva.estado not in ["ACTIVA"]:
        raise HTTPException(400, "La reserva no puede cancelarse")

    if datetime.utcnow() <= datetime.combine(reserva.fecha_clase, datetime.min.time()) - timedelta(hours=6):
        reserva.estado = "CANCELADA_A_TIEMPO"
    else:
        reserva.estado = "NO_ASISTIO"

    reserva.cancelada_en = datetime.utcnow()
    db.commit()

    return {"detail": "Reserva cancelada"}

# ===================== ABONOS =====================

@app.post("/abonos", response_model=AbonoResponse)
def crear_abono(abono: AbonoCreate, db: Session = Depends(get_db)):

    if not abono.fecha_pago:
        raise HTTPException(400, "Fecha de pago requerida")

    mes = abono.fecha_pago.month
    año = abono.fecha_pago.year

    nueva = Abono(
        alumna_id=abono.alumna_id,
        mes=mes,
        año=año,
        clases_incluidas=abono.clases_incluidas,
        clases_usadas=abono.clases_usadas,
        clases_recuperadas=abono.clases_recuperadas,
        fecha_pago=abono.fecha_pago,
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.get("/abonos", response_model=list[AbonoResponse])
def listar_abonos(db: Session = Depends(get_db)):
    return db.query(Abono).all()


@app.get("/abonos/{abono_id}", response_model=AbonoResponse)
def obtener_abono(abono_id: int, db: Session = Depends(get_db)):
    abono = db.get(Abono,abono_id)
    if not abono:
        raise HTTPException(404, "Abono no encontrada")
    return abono


@app.put("/abonos/{abono_id}", response_model=AbonoResponse)
def actualizar_abono(abono_id: int, datos: AbonoUpdate, db: Session = Depends(get_db)):
    abono = db.get(Abono,abono_id)
    if not abono:
        raise HTTPException(404, "Abono no encontrado")

    for k, v in datos.model_dump().items():
        setattr(abono, k, v)

    db.commit()
    db.refresh(abono)
    return abono


@app.post("/abonos/masivo")
def crear_abonos_masivos(mes: int, año: int, clases_incluidas: int, db: Session = Depends(get_db)):

    alumnas = db.query(Alumna).all()
    creados = 0

    for alumna in alumnas:

        existe = db.query(Abono).filter(
            Abono.alumna_id == alumna.id,
            Abono.mes == mes,
            Abono.año == año
        ).first()

        if existe:
            continue

        nuevo = Abono(
            alumna_id=alumna.id,
            mes=mes,
            año=año,
            clases_incluidas=clases_incluidas,
            clases_recuperadas=0,
            fecha_pago=date.today()
        )

        db.add(nuevo)
        creados += 1

    db.commit()

    return {"abonos_creados": creados}


@app.delete("/abonos/{abono_id}")
def eliminar_abono(abono_id: int, db: Session = Depends(get_db)):
    abono = db.get(Abono,abono_id)
    if not abono:
        raise HTTPException(404, "Abono no encontrada")

    db.delete(abono)
    db.commit()
    return {"detail": "Abono eliminada"}

# ================================RESUMEN ABONO==========================================
@app.get("/abonos/resumen/{alumna_id}")
def resumen_mensual(
    alumna_id: int,
    mes: int,
    año: int,
    db: Session = Depends(get_db)
):

    # Buscar abono
    abono = db.query(Abono).filter(
        Abono.alumna_id == alumna_id,
        Abono.mes == mes,
        Abono.año == año
    ).first()

    if not abono:
        raise HTTPException(404, "No existe abono para ese mes")

    # Reservas del mes
    reservas_mes = db.query(ReservaClase).filter(
        ReservaClase.alumna_id == alumna_id,
        extract("month", ReservaClase.fecha_clase) == mes,
        extract("year", ReservaClase.fecha_clase) == año
    ).all()

    # Contadores
    activas = sum(1 for r in reservas_mes if r.estado == "ACTIVA")
    asistidas = sum(1 for r in reservas_mes if r.estado == "ASISTIO")
    canceladas = sum(1 for r in reservas_mes if r.estado == "CANCELADA_A_TIEMPO")
    no_asistio = sum(1 for r in reservas_mes if r.estado == "NO_ASISTIO")

    usadas = activas + asistidas

    total_disponible = (
        abono.clases_incluidas +
        abono.clases_recuperadas
    )

    disponibles = total_disponible - usadas

    return {
        "alumna_id": alumna_id,
        "mes": mes,
        "año": año,

        "abono": {
            "clases_incluidas": abono.clases_incluidas,
            "clases_recuperadas": abono.clases_recuperadas,
            "total_habilitadas": total_disponible
        },

        "reservas": {
            "activas": activas,
            "asistidas": asistidas,
            "canceladas_a_tiempo": canceladas,
            "no_asistio": no_asistio,
            "usadas": usadas,
            "disponibles": max(disponibles, 0)
        },

        "detalle_reservas": [
            {
                "reserva_id": r.id,
                "clase_id": r.clase_id,
                "fecha": r.fecha_clase,
                "estado": r.estado,
                "es_recuperacion": r.es_recuperacion
            }
            for r in reservas_mes
        ]
    }


# ================================REVISIÓN DÍAS DEL MES==========================================

def fechas_del_mes_por_dia(año, mes, dia_semana):
    fechas = []
    _, ultimo_dia = calendar.monthrange(año, mes)

    for dia in range(1, ultimo_dia + 1):
        fecha = date(año, mes, dia)
        if fecha.weekday() == dia_semana:
            fechas.append(fecha)

    return fechas

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

    # 2️⃣ Total reservas activas del mes
    reservas_totales = (
        db.query(ReservaClase)
        .filter(
            func.extract("month", ReservaClase.fecha_clase) == mes,
            func.extract("year", ReservaClase.fecha_clase) == año,
            ReservaClase.estado == "ACTIVA"
        )
        .count()
    )

    # 3️⃣ Clases usadas (ASISTIO)
    clases_usadas = (
        db.query(ReservaClase)
        .filter(
            func.extract("month", ReservaClase.fecha_clase) == mes,
            func.extract("year", ReservaClase.fecha_clase) == año,
            ReservaClase.estado == "ASISTIO"
        )
        .count()
    )

    return {
        "mes": mes,
        "año": año,
        "alumnas_activas": alumnas_activas,
        "reservas_totales": reservas_totales,
        "clases_usadas": clases_usadas
    }

# ================================CUPOS DE CLASES==========================================

@app.get("/reservas/cupo")
def obtener_cupo(clase_id: int, fecha: date, db: Session = Depends(get_db)):

    clase = db.get(Clase, clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    reservas_activas = (
        db.query(ReservaClase)
        .filter(
            ReservaClase.clase_id == clase_id,
            ReservaClase.fecha_clase == fecha,
            ReservaClase.estado == "ACTIVA"
        )
        .count()
    )

    disponibles = clase.cantidad_alumnas - reservas_activas

    return {
        "cupo_total": clase.cantidad_alumnas,
        "reservados": reservas_activas,
        "disponibles": max(disponibles, 0)
    }
