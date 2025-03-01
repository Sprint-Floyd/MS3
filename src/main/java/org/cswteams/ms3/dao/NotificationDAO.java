package org.cswteams.ms3.dao;

import org.cswteams.ms3.entity.Notification;
import org.cswteams.ms3.entity.TenantUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface NotificationDAO extends JpaRepository<Notification,Long> {
    Set<Notification> findByUserAndStatus(TenantUser user, boolean status);
}

