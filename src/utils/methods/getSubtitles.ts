import type { MediaStream } from "@jellyfin/sdk/lib/generated-client";
import type subtitlePlaybackInfo from "../types/subtitlePlaybackInfo";

export default function getSubtitle(
	track: number | "nosub" | undefined,
	mediaStreams: MediaStream[] | undefined | null,
): subtitlePlaybackInfo | undefined {
	const availableSubtitles = mediaStreams?.filter(
		(stream) => stream.Type === "Subtitle",
	);
	if (!availableSubtitles?.length)
		return {
			track: -2,
			enable: false,
			format: "vtt",
			allTracks: availableSubtitles,
			url: null,
		};
	if (track === "nosub")
		return {
			track: -1,
			enable: false,
			format: "vtt",
			allTracks: availableSubtitles,
			url: null,
		};
	const requiredSubtitle = availableSubtitles?.filter(
		(stream) => stream.Index === track,
	);
	const url = requiredSubtitle?.[0]?.DeliveryUrl;
	console.log(track);
	if (track) {
		return {
			track,
			enable: true,
			format: requiredSubtitle?.[0]?.Codec,
			allTracks: availableSubtitles,
			url,
		};
	}
}