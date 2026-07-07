// Public demo credential ("Morty-level access"), advertised in the admin
// login page and the terminal. Not a secret: the admin API is a mock (writes
// echo back without persisting), so demo sessions can't touch real data.
// Overridable via DEMO_PASSWORD on the server side.
export const DEMO_PASSWORD = "wubbalubbadubdub";
