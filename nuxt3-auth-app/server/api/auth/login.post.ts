import { defineEventHandler, readBody, createError } from 'h3';
import usersData from '~/server/data/users.json';


export interface UserSessionInfo {
    name: string;
    surname: string;
    username: string;
    active: boolean;
    created: string;
}


function getPasswordFromComment(user: any): string | null {
    if (!user._comment) return null;
    
    const match = user._comment.match(/'([^']+)'/);
    return match ? match[1] : null;
}

export default defineEventHandler(async (event) => {
    try {
        
        const body = await readBody(event);
        const { username, password } = body;

        
        if (!username || !password) {
            throw createError({ 
                statusCode: 400, 
                statusMessage: 'Логин и пароль обязательны для заполнения' 
            });
        }

        
        const user = usersData.find(u => u.credentials.username === username);

        
        if (!user) {
            console.warn(`Неудачная попытка входа: Пользователь не найден - ${username}`);
            throw createError({ 
                statusCode: 401, 
                statusMessage: 'Введены неверные данные авторизации. Попробуйте ещё раз' 
            });
        }

        
        const originalPassword = getPasswordFromComment(user);


        const isValidPassword = 
            user.credentials.passphrase === password || 
            (originalPassword && originalPassword === password); 
            
        if (!isValidPassword) {
            console.warn(`Неудачная попытка входа: Неверный пароль для пользователя - ${username}`);
            throw createError({ 
                statusCode: 401, 
                statusMessage: 'Введены неверные данные авторизации. Попробуйте ещё раз' 
            });
        }

        
        if (!user.active) {
            console.warn(`Неудачная попытка входа: Пользователь неактивен - ${username}`);
            throw createError({ 
                statusCode: 403, 
                statusMessage: 'Пользователь неактивен' 
            });
        }

        console.log(`Успешный вход для пользователя: ${username}`);

       
        const userSessionInfo: UserSessionInfo = {
            name: user.name,
            surname: user.surname,
            username: user.credentials.username,
            active: user.active,
            created: user.created
        };

        return { user: userSessionInfo };
    } catch (error) {
        console.error('Ошибка входа:', error);
        throw error;
    }
}); 