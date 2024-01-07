package org.cswteams.ms3.control.task;

import org.cswteams.ms3.dao.TaskDAO;
import org.cswteams.ms3.entity.Doctor;
import org.cswteams.ms3.entity.MedicalService;
import org.cswteams.ms3.entity.Task;
import org.cswteams.ms3.enums.TaskEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskController implements ITaskController {

    @Autowired
    TaskDAO taskDAO;
/*
    @Override
    public Set<RotationDTO> leggiTurniDiServizio(String servizio) {
        //return MappaTurni.turnoEntityToDTO(turnoDao.findAllByServizioNome(servizio));
        return null;
    }

    @Override
    public Set<RotationDTO> leggiTurni() {
        //return MappaTurni.turnoEntityToDTO(turnoDao.findAll());
        return null;
    }

    @Override
    public Shift creaTurno(RotationDTO turno) throws ShiftException {
        //Shift shiftEntity = MappaTurni.turnoDTOToEntity(turno);
        //return turnoDao.save(shiftEntity);
        return null;
    }*/

    @Override
    public void assignDoctorToTask(Task task, Doctor doctor) {
        task.addDoctor(doctor);
        taskDAO.saveAndFlush(task);
    }

    @Override
    public void assignDoctorToMedicalService(MedicalService medicalService, Doctor doctor) {
        //FIXME serve sapere anche a quale task del servizio il doctor deve essere assegnato
    }

    @Override
    public Task createTaskWithType(TaskEnum taskType) {
        Task t = new Task(taskType);
        taskDAO.saveAndFlush(t);
        return t;
    }
}
