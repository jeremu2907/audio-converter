apt update
apt install -y wget xz-utils gcc pkg-config make

cd /
wget https://ffmpeg.org/releases/ffmpeg-7.0.1.tar.xz
tar xf ffmpeg-7.0.1.tar.xz
rm -rf ffmpeg-7.0.1.tar.xz

cd /ffmpeg-7.0.1

./configure --disable-ffplay --disable-doc --disable-swresample --disable-swscale --disable-postproc --disable-w32threads --disable-network --disable-dwt --disable-error-resilience --disable-lsp --disable-faan --disable-pixelutils --disable-everything

make && make install
