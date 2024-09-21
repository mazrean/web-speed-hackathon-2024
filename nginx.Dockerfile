FROM ubuntu:22.04 as builder

RUN apt update && apt install -y \
  libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN wget https://nginx.org/download/nginx-1.25.3.tar.gz \
  && tar -zxf nginx-1.25.3.tar.gz 
RUN git clone --recurse-submodules https://github.com/google/ngx_brotli 

WORKDIR /app/nginx-1.25.3
RUN ./configure --with-compat --add-dynamic-module=../ngx_brotli 
RUN make modules

FROM nginx:1.25.3

COPY --from=builder /app/nginx-1.25.3/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=builder /app/nginx-1.25.3/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/

COPY ./nginx/brotli.conf /etc/nginx/conf.d/brotli.conf
