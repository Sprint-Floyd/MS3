create table doctor
(
    ms3_system_user_id bigint       not null
        primary key,
    birthday           date         not null,
    email              varchar(255) not null,
    lastname           varchar(255) not null,
    name               varchar(255) not null,
    password           varchar(255) not null,
    tax_code           varchar(255) not null,
    seniority          integer      not null
);

alter table doctor
    owner to sprintfloyd;


create table doctor_holidays
(
    doctor_holidays_id        bigint not null
        primary key,
    holiday_map               oid    not null,
    doctor_ms3_system_user_id bigint not null
        constraint fkfvgbw7dtyh2udi5gt75bbkmtl
            references doctor
);

alter table doctor_holidays
    owner to sprintfloyd;