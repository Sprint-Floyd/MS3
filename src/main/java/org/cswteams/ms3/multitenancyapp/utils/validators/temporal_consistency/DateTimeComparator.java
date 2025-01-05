package org.cswteams.ms3.multitenancyapp.utils.validators.temporal_consistency;

import java.time.LocalDate;

public class DateTimeComparator implements Comparator {
    @Override
    public boolean compare(Object first, Object second) {
        return ((LocalDate) first).isBefore((LocalDate) second) ;
    }
}
