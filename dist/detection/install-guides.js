const INSTALL_GUIDES = {
    ImageMagick: {
        debian: "sudo apt-get install imagemagick",
        ubuntu: "sudo apt-get install imagemagick",
        fedora: "sudo dnf install ImageMagick",
        arch: "sudo pacman -S imagemagick",
        suse: "sudo zypper install ImageMagick",
        macos: "brew install imagemagick",
        windows: "choco install imagemagick OR winget install ImageMagick.ImageMagick",
        freebsd: "sudo pkg install ImageMagick7",
        openbsd: "doas pkg_add ImageMagick",
        "linux-unknown": "Install ImageMagick via your package manager",
    },
    cwebp: {
        debian: "sudo apt-get install webp",
        ubuntu: "sudo apt-get install webp",
        fedora: "sudo dnf install libwebp-tools",
        arch: "sudo pacman -S libwebp",
        suse: "sudo zypper install libwebp-tools",
        macos: "brew install webp",
        windows: "choco install webp OR download from https://developers.google.com/speed/webp/download",
        freebsd: "sudo pkg install webp",
        openbsd: "doas pkg_add libwebp",
        "linux-unknown": "Install libwebp/webp-tools via your package manager",
    },
    avifenc: {
        debian: "sudo apt-get install libavif-bin",
        ubuntu: "sudo apt-get install libavif-bin",
        fedora: "sudo dnf install libavif-tools",
        arch: "sudo pacman -S libavif",
        suse: "sudo zypper install libavif-tools",
        macos: "brew install libavif",
        windows: "Download from https://github.com/AOMediaCodec/libavif/releases",
        freebsd: "sudo pkg install libavif",
        openbsd: "doas pkg_add libavif",
        "linux-unknown": "Install libavif via your package manager",
    },
};
export function getInstallGuide(dependency, platform) {
    const guide = INSTALL_GUIDES[dependency];
    if (!guide) {
        return `Install ${dependency} for your platform`;
    }
    return guide[platform];
}
//# sourceMappingURL=install-guides.js.map