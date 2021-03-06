ZerkZoeker
========

## Authors
[Bastiaan Andriessen](https://github.com/BastiaanAndriessen “Bastiaan Andriessen”),
[Andreas De Lille](https://github.com/AndreasDL “Andreas De Lille”),
[Maarten Bamelis](https://github.com/mbamelis “Maarten Bamelis”) and
[Ruben Meul](https://github.com/RubenMeul “RubenMeul”)

## General Description
This web app (Zerk Zoeker) shows all locations of the graves at the cemeteries of Avelgem, Deerlijk and Waregem in Belgium.
This project is part of #oSoc14.

## Structure
* doc/ : Documentation
* backend/ : folder for the backend (silex), also see doc/Backend.txt
* other folders : html5 & js code

## Installation
### Backend
* Uses Silex, composer file included.
* Database needed, definitions included in database.sql ; designed and tested for mariadb / mysql.
* create config.php file containing location and login of database. See backend/configTemplate.php for a template.

## Doc
View doc/Backend.txt for more information about the backend.

## Copyright
© OKFN Belgium vzw/asbl

License: [AGPL3](http://www.gnu.org/licenses/agpl-3.0.html "AGPL3")
