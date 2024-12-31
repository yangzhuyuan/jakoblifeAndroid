#!/bin/sh
set -e
set -u
set -o pipefail

function on_error {
  echo "$(realpath -mq "${0}"):$1: error: Unexpected failure"
}
trap 'on_error $LINENO' ERR


# This protects against multiple targets copying the same framework dependency at the same time. The solution
# was originally proposed here: https://lists.samba.org/archive/rsync/2008-February/020158.html
RSYNC_PROTECT_TMP_FILES=(--filter "P .*.??????")


copy_dir()
{
  local source="$1"
  local destination="$2"

  # Use filter instead of exclude so missing patterns don't throw errors.
  echo "rsync --delete -av "${RSYNC_PROTECT_TMP_FILES[@]}" --links --filter \"- CVS/\" --filter \"- .svn/\" --filter \"- .git/\" --filter \"- .hg/\" \"${source}*\" \"${destination}\""
  rsync --delete -av "${RSYNC_PROTECT_TMP_FILES[@]}" --links --filter "- CVS/" --filter "- .svn/" --filter "- .git/" --filter "- .hg/" "${source}"/* "${destination}"
}

SELECT_SLICE_RETVAL=""

select_slice() {
  local paths=("$@")
  # Locate the correct slice of the .xcframework for the current architectures
  local target_path=""

  # Split archs on space so we can find a slice that has all the needed archs
  local target_archs=$(echo $ARCHS | tr " " "\n")

  local target_variant=""
  if [[ "$PLATFORM_NAME" == *"simulator" ]]; then
    target_variant="simulator"
  fi
  if [[ ! -z ${EFFECTIVE_PLATFORM_NAME+x} && "$EFFECTIVE_PLATFORM_NAME" == *"maccatalyst" ]]; then
    target_variant="maccatalyst"
  fi
  for i in ${!paths[@]}; do
    local matched_all_archs="1"
    for target_arch in $target_archs
    do
      if ! [[ "${paths[$i]}" == *"$target_variant"* ]]; then
        matched_all_archs="0"
        break
      fi

      # Verifies that the path contains the variant string (simulator or maccatalyst) if the variant is set.
      if [[ -z "$target_variant" && ("${paths[$i]}" == *"simulator"* || "${paths[$i]}" == *"maccatalyst"*) ]]; then
        matched_all_archs="0"
        break
      fi

      # This regex matches all possible variants of the arch in the folder name:
      # Let's say the folder name is: ios-armv7_armv7s_arm64_arm64e/CoconutLib.framework
      # We match the following: -armv7_, _armv7s_, _arm64_ and _arm64e/.
      # If we have a specific variant: ios-i386_x86_64-simulator/CoconutLib.framework
      # We match the following: -i386_ and _x86_64-
      # When the .xcframework wraps a static library, the folder name does not include
      # any .framework. In that case, the folder name can be: ios-arm64_armv7
      # We also match _armv7$ to handle that case.
      local target_arch_regex="[_\-]${target_arch}([\/_\-]|$)"
      if ! [[ "${paths[$i]}" =~ $target_arch_regex ]]; then
        matched_all_archs="0"
        break
      fi
    done

    if [[ "$matched_all_archs" == "1" ]]; then
      # Found a matching slice
      echo "Selected xcframework slice ${paths[$i]}"
      SELECT_SLICE_RETVAL=${paths[$i]}
      break
    fi
  done
}

install_xcframework() {
  local basepath="$1"
  local name="$2"
  local package_type="$3"
  local paths=("${@:4}")

  # Locate the correct slice of the .xcframework for the current architectures
  select_slice "${paths[@]}"
  local target_path="$SELECT_SLICE_RETVAL"
  if [[ -z "$target_path" ]]; then
    echo "warning: [CP] Unable to find matching .xcframework slice in '${paths[@]}' for the current build architectures ($ARCHS)."
    return
  fi
  local source="$basepath/$target_path"

  local destination="${PODS_XCFRAMEWORKS_BUILD_DIR}/${name}"

  if [ ! -d "$destination" ]; then
    mkdir -p "$destination"
  fi

  copy_dir "$source/" "$destination"
  echo "Copied $source to $destination"
}

install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/mobileffmpeg.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libavcodec.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-arm64" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libavdevice.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-x86_64-simulator" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libavfilter.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-arm64" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libavformat.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libavutil.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libswresample.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libswscale.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/expat.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/fontconfig.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/freetype.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/fribidi.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/giflib.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/gmp.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/gnutls.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-x86_64-simulator" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/jpeg.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/kvazaar.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/lame.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libaom.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libass.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libhogweed.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-arm64" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libilbc.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libnettle.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libogg.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libopencore-amrnb.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libpng.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-arm64" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libsndfile.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libtheora.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libtheoradec.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libtheoraenc.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libvorbis.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libvorbisenc.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libvorbisfile.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libvpx.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-x86_64-maccatalyst" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libwebp.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-simulator" "ios-arm64" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libwebpmux.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libwebpdemux.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libxml2.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-x86_64-simulator" "ios-arm64"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/opus.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/shine.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/snappy.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/soxr.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/speex.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/tiff.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/twolame.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/vo-amrwbenc.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/wavpack.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-simulator" "ios-x86_64-maccatalyst"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/libvidstab.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/x264.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/x265.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-x86_64-maccatalyst" "ios-arm64" "ios-x86_64-simulator"
install_xcframework "${PODS_ROOT}/mobile-ffmpeg-full-gpl/xvidcore.xcframework" "mobile-ffmpeg-full-gpl" "framework" "ios-arm64" "ios-x86_64-maccatalyst" "ios-x86_64-simulator"

