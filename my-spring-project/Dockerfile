FROM maven:3.6.3-jdk-8

COPY ./ ./

RUN mvn clean package

EXPOSE 8080

CMD ["java", "-jar", "target/my-spring-project-0.0.1-SNAPSHOT.jar"]