const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
// const AdminBroSequelize = require('admin-bro-sequelizejs')
//password encryption(hashing)
const bcrypt = require('bcrypt')
const {User, Author, Genre, Book, BookInstance} = require('./models')
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Grouping of models in admin panels
const contentParent = {
  name: 'contents',
  icon: 'Accessibility',
}

/* check if user is admin and have proper rights for 
modifying/add the data */
const isAdmin = ({ currentAdmin }) =>{
  if (currentAdmin && currentAdmin.role === 'Admin')
    return true;
  return false;
}

AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
  // resources: [User],   
  resources: [
    {
      resource: User,
      // options: { 
      //   //navigation parent bar
      //   parent: contentParent,
      //   listProperties: ['name', 'email', 'avatar_url', 'bio'], 
      //   filterProperties: ['name', 'email', ], 
      //   showProperties: ['name', 'email', 'avatar_url', 'bio'], 
      //   editProperties: ['name', 'email', 'avatar_url', 'bio'] 
      // }
      //Another way to do the options
      options: {
        // We'll add this later
        parent: contentParent,
        properties: {
          name: { 
            isVisible: { 
              list: true,
              filter: true, 
              show: true, 
              edit: true 
            }, 
            position: -1    //set position of a column in list => -1, 100 ...
          },
          email: { 
            isVisible: { 
              list: true, 
              filter: true, 
              show: true, 
              edit: true
            }
          },
          encryptedPassword: { 
            isVisible: { 
              list: false, 
              filter: false, 
              show: false, 
              edit: false
            },
            // type: 'richtext'
          },
          password: {
            type: 'password',
            isVisible: {
              list: false,
              filter: false,
              show: false,
              edit: true
            }
          },
          avatar_url: { 
            isVisible: { 
              list: true,
              filter: false, 
              show: true, 
              edit: true 
            } 
          },
          bio: { 
            isVisible: { 
              list: true, 
              filter: false, 
              show: true, 
              edit: true 
            },
            availableValues: [{
                value: 'geography',
                label: 'geography'
              },
              {
                value: 'computerScience',
                label: 'computer science'
              },
              {
                value: 'electrical',
                label: 'electrical'
              }
            ]
            
          },
        },
        actions: {
          new: {
            isAccessible: true
          },
          new: {
            before: async (request) => {
              console.log(request.payload);
              if (request.payload.password){
                
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                  password: undefined
                }
              }

              return request
            },
            after: async (response) => {
              console.log(response)
              return response
            }
          },
          edit: {
            before: async (request) => {
              console.log(request.payload);
              if (request.payload.password){
                
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                  password: undefined
                }
              }

              return request
            },

          },

          edit : {
            isAccessible: isAdmin
          },
          delete: {
            isAccessible: isAdmin
          },

        }
      }
    }, 
    {
      resource: Author, 
      options: {

      }
    },
    {
      resource: Genre, 
      options: {
        
      }
    }, 
    {
      resource: Book, 
      options: {
        
      }
    }, 
    {
      resource: BookInstance, 
      options: {
        
      }
    }
  ] ,
  loginPath: '/admin/login',
  rootPath: '/admin',
  logoutPath: '/admin/logout',
  branding: {
    // logo: 'URL_TO_LOGO',
    companyName: 'R3YGaming',
    softwareBrothers: false
  }
})
const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro,  {
  authenticate: async (email, password) => {
    const user = await User.findOne({email: email});
    if (user){
      const MatchedEntry = await bcrypt.compare(password, user.encryptedPassword);
      if (MatchedEntry){
        return user; 
      }
    }
    return false
  },
  cookieName: 'admin-bro',
  cookiePassword: '#cookiepasswordshouldhavecomplexdata'
  }, null,{
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
})

module.exports = {
  adminRouter
}