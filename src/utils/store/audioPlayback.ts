import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { create } from "zustand";
import { setQueue } from "./queue";

type AudioPlaybackStore = {
	display: boolean;
	url: string;
	item: BaseItemDto | undefined | null;
	playlistItemId: string | undefined;
};
export const useAudioPlayback = create<AudioPlaybackStore>(() => ({
	display: false,
	url: "",
	item: undefined,
	playlistItemId: undefined,
}));

export const playAudio = (
	url: string,
	item: BaseItemDto | undefined | null,
	playlistItemId: string | undefined,
	queue: BaseItemDto[] | undefined,
	queueItemIndex: number,
): void => {
	useAudioPlayback.setState({
		display: true,
		url,
		item,
		playlistItemId,
	});
	setQueue(queue, queueItemIndex);
};

export const generateAudioStreamUrl = (
	itemId: string,
	userId: string,
	deviceId: string,
	basePath: string,
) => {
	const urlOptions = {
		userId,
		deviceId,
	};
	const urlParams = new URLSearchParams(urlOptions).toString();
	return `${basePath}/Audio/${itemId}/universal?${urlParams}`;
};