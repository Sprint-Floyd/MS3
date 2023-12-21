package org.cswteams.ms3.control.concreteShift;

import org.cswteams.ms3.dto.ConcreteShiftDTO;
import org.cswteams.ms3.dto.RegistraAssegnazioneTurnoDTO;
import org.cswteams.ms3.entity.ConcreteShift;
import org.cswteams.ms3.exception.AssegnazioneTurnoException;

import java.text.ParseException;
import java.util.Set;

public interface IConcreteShiftController {
    Set<ConcreteShiftDTO> leggiTurniAssegnati() throws ParseException;

    ConcreteShift creaTurnoAssegnato(RegistraAssegnazioneTurnoDTO c) throws AssegnazioneTurnoException;

    Set<ConcreteShiftDTO> leggiTurniUtente(Long idUtente) throws ParseException;

    ConcreteShift leggiTurnoByID(long idAssegnazione);

}