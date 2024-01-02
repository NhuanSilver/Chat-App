insert into users (username, avatar_url, full_name, password, status)
values ('nhuan',
        'https://afamilycdn.com/zoom/640_400/2019/2/25/avatar1551079860411-1551079860411686096470-crop-15510798867791793347140.jpg',
        'Nhuận Nguyễn',
        '123',
        1);
insert into users(username, avatar_url, full_name, password, status)
values ('test',
        'https://cdn.24h.com.vn/upload/2-2021/images/2021-05-31/anh-4-1622435533-350-width650height813.jpg',
        'Nguyễn Văn Test',
        '123',
        1);
insert into users(username, avatar_url, full_name, password, status)
values ('buon',
        'https://kenh14cdn.com/2019/9/27/566226151661511044021668004432122225985389n-1569234596911848541502-1569517951952686128625.jpg',
        'Khi Ta Không Còn Nhau',
        '123',
        1);
insert into conversation
values (1,'Test Conversation');
insert into conversation
values (2,'Test Conversation 2');

insert into users_conversations(users_username, conversations_id)
values ('nhuan',
        1);
insert into users_conversations(users_username, conversations_id)
values ('buon',
        1);

insert into users_conversations(users_username, conversations_id)
values ('test',
        2);
insert into users_conversations(users_username, conversations_id)
values ('nhuan',
        2);