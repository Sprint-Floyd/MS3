package org.cswteams.ms3.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import lombok.Data;

@Entity
@Data
/*@Table(uniqueConstraints={
    @UniqueConstraint(columnNames={
        "utente_id",
        "schedule_id",
    })
})*/

public class UserScheduleState {
    
    @Id
    @GeneratedValue
    private Long id;
    
    /**  Utente a cui appartiene questo stato */
    @ManyToOne
    private User utente;

    /**  Pianificazione a cui appartiene questo stato */
    @OneToOne
    private Schedule schedule;

    private int uffaParziale=0;
    private int uffaCumulativo=0;

    /** tutti i turni assegnati a questo utente nella pianificazione corrente */
    @Transient
    List<ConcreteShift> assegnazioniTurnoCache;



    public List<ConcreteShift> getAssegnazioniTurnoCache(){
        
        if (assegnazioniTurnoCache == null){
            this.assegnazioniTurnoCache = new ArrayList<>();
            for (ConcreteShift at: schedule.getConcreteShifts()){
                for (DoctorAssignment collega : at.getDoctorAssignmentList()){
                    if (collega.getDoctor().getId() == this.utente.getId()){
                        assegnazioniTurnoCache.add(at);
                        break;
                    }
                }
            }
        }
        return assegnazioniTurnoCache;
    }

    /**Aggiunge in ordine la nuova assegnazione alla lista delle assegnazioni dell'utente **/
    public void addAssegnazioneTurno(ConcreteShift nuovaAssegnazione){
        /*List<ConcreteShift> turniAssegnati = getAssegnazioniTurnoCache();
        int idInsert = turniAssegnati.size();
        for(int i = 0; i < turniAssegnati.size(); i++){
            if(turniAssegnati.get(i).getData().isAfter(nuovaAssegnazione.getData()) || turniAssegnati.get(i).getData().isEqual(nuovaAssegnazione.getData())){
                if(turniAssegnati.get(i).getTurno().getOraInizio().isAfter(nuovaAssegnazione.getTurno().getOraInizio())) {
                    idInsert = i;
                }
            }
        }
        turniAssegnati.add(idInsert,nuovaAssegnazione);*/
    }

    public void saveUffaTemp(){
        this.uffaCumulativo = this.uffaParziale;
    }

    public void addUffaTemp(int uffa){
        this.uffaParziale =this.uffaCumulativo+ uffa;
    }

    public UserScheduleState() {
    }
    
    public UserScheduleState(User utente, Schedule schedule) {
        this.utente = utente;
        this.schedule = schedule;
    }
}
