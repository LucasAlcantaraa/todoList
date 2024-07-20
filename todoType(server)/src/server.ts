const PORT = parseInt(`${process.env.PORT || 3002}`);

import app from './app';
 
app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));