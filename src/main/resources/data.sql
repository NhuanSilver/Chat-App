insert into users (username, avatar_url, full_name, password, status, role)
values ('nhuan',
        'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
        'Nhuận Nguyễn',
        '$2a$10$yRzl/a4cKos2Gu731mpRJueuA5TPogOOZpcq.PqJO6Z7aUxadZhae',
        1,'USER');
insert into users(username, avatar_url, full_name, password, status, role)
values ('buon',
        'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png',
        'Buồn',
        '$2a$10$yRzl/a4cKos2Gu731mpRJueuA5TPogOOZpcq.PqJO6Z7aUxadZhae',
        1,
        'USER');
insert into users(username, avatar_url, full_name, password, status, role)
values ('lam',
        'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/4_avatar-512.png',
        'Lắm',
        '$2a$10$yRzl/a4cKos2Gu731mpRJueuA5TPogOOZpcq.PqJO6Z7aUxadZhae',
        1,'USER');

-- insert into conversation(is_group, id, name) values (1, 1 ,'Nhóm 1');
-- insert into users_conversations(conversations_id, users_username) values (1, 'nhuan');
-- insert into users_conversations(conversations_id, users_username) values (1, 'buon');
-- insert into users_conversations(conversations_id, users_username) values (1, 'lam');
