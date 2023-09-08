import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

import { getUser } from '@/services/prisma';

export const authOptions: NextAuthOptions  = {

    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        maxAge: 86400,
    },
    session: {
        maxAge: 86400,
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        // error: '/login', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/login' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    providers: [
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID || '',
        //     clientSecret: process.env.FACEBOOK_SECRET || '',
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),
        // ...add more providers here
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Usuario',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                user: { label: 'Usuario', type: 'text', placeholder: 'Usuario' },
                pass: { label: 'Contraseña', type: 'password' }
            },
            
            async authorize (credentials, req) {
                
                const dbUser = await getUser(credentials?.user || '', credentials?.pass || '', false);
                
                if (dbUser && dbUser.status === 'ACTIVE') {
                    // Any object returned will be saved in `user` property of the JWT
                    return dbUser as any;
                } else {
                    return null
                }
            }
        }),
    ],

    callbacks: {
        async jwt({ token, account, user }) {
            //payload added here
            
            if( account ) {
                token.accessToken = account.access_token;
                
                switch (account.type) {
                    case 'credentials':
                        token.user = user;
                        break;
                    case 'email':
                        // TODO: Implementar posteriormente
                        break;
                    case 'oauth':
                        // TODO: verificar reglas de creacion de usuarios bussinesslogic
                        break;
                    
                    default:
                        break;
                }
            } 
            return token;
        },

        async session({ session, token, user }) {
            //payload added here
            session.accessToken = token.accessToken;
            session.user = token.user;
            
            return session;
        },

    },
}


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }