#!/bin/bash
cd /app 
mvn spring-boot:run -Dmaven.test.skip=true -Drun.jvmArguments="-Xmx512m -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
