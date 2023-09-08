import { PrismaClient } from '@prisma/client'
import * as bcryptjs from 'bcryptjs';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined 
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Returns user, status and his roles
export const getUser = async(userLoginName: string, userPass: string, checkStatus: boolean) => {

  try {
    const dbUser = await prisma.uSERS_USR.findFirst(
        {
            select: {
                USR_STATUS: true,
                USR_LOGIN_NAME: true,
                USR_EMAIL: true,
                USR_PASSWORD: true,
                USR_has_SYSR: {
                    select: {
                        SYSTEM_ROLES_SYSR: {
                            select: {
                                SYSR_CODE: true
                            }
                        }
                    }
                }
            },
            where: {
              USR_LOGIN_NAME: userLoginName
                // [searchTerm]: {
                //     equals: searchData
                // },
            }
        }
    )
    

    if(!dbUser || !checkStatus && !bcryptjs.compareSync(userPass, dbUser.USR_PASSWORD || ''))
        throw new Error('No user or wrong password');
    
    let uRoles:string[] = [];
    if (dbUser) {
      uRoles = dbUser.USR_has_SYSR.map( sysRole => {
        return sysRole.SYSTEM_ROLES_SYSR.SYSR_CODE;
      });
    }
    
    return {
      status: dbUser?.USR_STATUS || '',
      login_name: dbUser?.USR_LOGIN_NAME || '',
      email: dbUser?.USR_EMAIL || '',
      roles: uRoles,
    }
  } catch (error) {
    // TODO: LOGS ARCHIVOS
    console.log(error);
    return {
      status: '',
      login_name: '',
      email: '',
      roles: [],
    }
  }

}