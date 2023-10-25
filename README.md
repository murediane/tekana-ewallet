# tekana-e-wallet  MVP

## Project settup
 -  create .env according to .env.example 
 -  install the project  dependencies by  running in the terminal  :
 ####  npm install
 -   to start the project :
 #### npm run start:dev

## endpoint implemented in this project 
 ### Users
 - client registration : 
 ##### POST :{{baseUrl}}/users
 - login
 ##### POST :{{baseUrl}}/auth/login

 - admin registration :
 ##### POST :{{baseUrl}}//users/admin

 -  admin fetch  all users :
 ##### GET  : {{baseUrl}}/users

 -  get user by email :
 ##### GET : {{baseUrl}}/localhost:1000/users/user_email/:email

 ### wallets
  - wallet creation is done upon client creation to avoid having a client without a wallet 
  - Admin fetch all wallets : 
  ##### GET : {{baseUrl}}/wallets

  - find user wallet by user email :
  ##### GET : {{baseUrl}}/wallets/user-email/:email
  - admin topup wallet :
  ##### POST : {{baseUrl}}/ wallets /admin-topup/:id
  - money transfer :
  ##### POST : {{baseUrl}}/wallets/transfer

  ### Transaction
   - Transaction is created when topup or transfer is done
   -  admin get user transaction  : 
   ##### GET : {{ baseUrl}}/wallets/transaction/user/:userId


#   step by step strategy  for tekana-e- wallet revamp 

## 1. Discovery & Requirement Gathering
- The product owner will conduct a series of interviews with the business team and existing users to understand current pain points, needs, and requirements.
- The technical team will review the existing system's documentation (if available) to understand its architecture, database design, and functionalities.

## 2. Team Alignment & Setting Expectations
- As the team lead I will set up an initial team meeting with back-ends, front-ends, UI/UX designers, product owner, and Scrum Master to align on the project goals and expectations.
-  I will define roles and responsibilities for each team member.
-   We will discuss as a team which Agile methodologies and tools (e.g., JIRA, Trello) to track tasks and progress.
- I will consult with the CTO to set overall timelines for product completion. 

## 3. Technical Analysis 
- Analyze the technical debt and issues in the existing system.
- Decide on the tech stack for the back end (e.g., NestJS, PostgreSQL/MongoDB, Redis).
- Discuss on whether to use microservice architecture to ensure system scalability and efficiency.
- Ensure the tech stack can support the expected user load and can easily scale with growth.
- Collaborate with the UI/UX design team to understand potential new designs and any new features they're considering.


## 4. Planning Database Migration 
- Design the new database schema while considering optimization, future scalability, and any new features.
- Plan the data migration strategy to ensure data disaster recovery management, a smooth transition to the new system, and transfer without data loss.

## 5. Development Sprints
- discuss the length of sprints(eg:2-3 weeks long).
- Prioritize features and tasks based on business needs and technical dependencies.
- Regularly review progress with the product owner and engineers.

## 6. API & Integration Strategy
- Define clear  API needed, considering current front-end requirements and potential future use cases.
- Plan for external systems integrations ensuring security and efficiency.

## 7. Security Measures
- Prioritize security. Consider encryption,  rate limiting, load balancing, regular security audits, and compliance.
- Implement authentication and authorization strategies.


## 8. Testing & Quality Assurance
- Implement automated unit and integration tests.
- Conduct end-to-end testing and performance testing after major milestones.
-  Plan an internal alpha test to get feedback about the product before it goes live 
- Engage with a group of beta users for real-world testing.

## 9. Collaboration with Front-End & UI/UX Teams
- Communicate regularly with the front-end team to ensure API alignment.
- Understand the UI/UX flow for backend support.

## 10. Staging & User Acceptance Testing (UAT)
- Deploy to a staging environment that mimics production.
- Conduct UAT with the business team.

## 11. Deployment Strategy
- Plan for continuous integration and deployment in the development environment and plan for staging, the production environment.
- Use tools like Docker and Kubernetes for deployment and scaling.

## 12. Monitoring & Maintenance
- Implement monitoring tools to keep an eye on system health.
- Plan for regular maintenance of the system.

## 13. Feedback Loop & Iterative Improvements
- Gather feedback post-go-live.
- Plan for implementation of the fix and new features based on feedback.

## 14. Documentation & Knowledge Transfer
- Maintain updated documentation.
- Ensure knowledge transfer among the team.

## 15. Final Review & Go-Live
- Conduct a final review with stakeholders.
- Roll out the system fully with a rollback plan in place.

## 16. Post Go-Live Support
- Provide support for all issues that are reported  post-go-live.
- Plan for regular reviews and updates.

