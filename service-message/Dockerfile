FROM golang:1.11.2 as builder
ADD ./ /src/app/
WORKDIR /src/app
RUN go mod download
RUN CGO_ENABLED=0 go build -o app


FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /src/app/
COPY --from=builder /src/app/app .
CMD ["./app"]