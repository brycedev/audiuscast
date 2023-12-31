import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { router, useForm } from "@inertiajs/react";
import { Fragment } from "react";

import {
    ArrowRightIcon,
    ChevronRightIcon,
    Cog8ToothIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition, Switch } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function DeleteInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    );
}

function DeleteActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
        </svg>
    );
}

export default function Dashboard({ auth, podcast, syncs }) {
    const { data, setData, post, processing, errors } = useForm({
        url: "",
    });
    const hasPodcast = typeof podcast !== "undefined" && podcast !== null;
    function submitFeedForm(e) {
        e.preventDefault();
        post("/podcasts");
    }
    function refreshFeed(e) {
        e.preventDefault();
        post("/podcasts/refresh");
    }
    function syncAll(e) {
        e.preventDefault();
        router.post("/syncs/all");
    }
    function deletePodcast(e) {
        e.preventDefault();
        router.delete(`/podcasts/`);
    }
    function setAutoSync(e) {
        podcast.auto_sync = e;
        router.put(`/podcasts/`, { auto_sync: e });
    }
    function syncEpisode(episode, retry = false) {
        let payload = {
            podcast_id: podcast.id,
            title: episode.title,
            source: episode.source,
            image: episode.image,
            guid: episode.guid,
        };
        if (retry) {
            payload.retry = true;
        }
        router.post("/syncs", payload);
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <main className="lg:pl-72 h-screen">
                <div className="xl:pr-72">
                    {!hasPodcast && (
                        <>
                            <div className="h-screen">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                                        <div className="mx-auto max-w-2xl text-center">
                                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                                Let's link your podcast
                                            </h2>
                                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                                                Enter the RSS feed URL for your
                                                podcast to begin syncing your
                                                episodes with Audius.
                                            </p>
                                            <form
                                                onSubmit={(e) =>
                                                    submitFeedForm(e)
                                                }
                                                className="mt-10 flex items-center justify-center gap-x-4"
                                            >
                                                <input
                                                    onChange={(e) =>
                                                        setData(
                                                            "url",
                                                            e.target.value
                                                        )
                                                    }
                                                    id="podcast-url"
                                                    name="url"
                                                    type="url"
                                                    value={data.url}
                                                    required
                                                    className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-audius-600 sm:text-sm sm:leading-6"
                                                    placeholder="Enter your podcast RSS feed URL"
                                                />

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-md bg-audius-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-audius-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-audius-600"
                                                >
                                                    <ArrowRightIcon className="h-5 w-5" />
                                                </button>
                                            </form>
                                            <p className="text-sm text-red-500 font-semibold mt-4">
                                                {errors.url}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {hasPodcast && (
                        <div className="">
                            {/* Page title & actions */}
                            <div className="border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
                                        {podcast.name}
                                    </h1>
                                </div>
                                <div className="mt-4 flex items-center sm:ml-4 sm:mt-0">
                                    <Menu
                                        as="div"
                                        className="relative md:inline-block text-left hidden"
                                    >
                                        <Menu.Button>
                                            <Cog8ToothIcon className="mt-2 h-5 w-5 text-gray-400" />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none">
                                                <div className="px-1 py-1 ">
                                                    <div className="px-2 py-2 flex items-center justify-between">
                                                        <Switch.Group>
                                                            <Switch.Label className="mr-4">
                                                                <p className="text-sm text-gray-900">
                                                                    Auto Sync
                                                                </p>
                                                            </Switch.Label>
                                                            <Switch
                                                                checked={
                                                                    podcast.auto_sync
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setAutoSync(
                                                                        e
                                                                    );
                                                                }}
                                                                className={`${
                                                                    podcast.auto_sync
                                                                        ? "bg-audius-600"
                                                                        : "bg-audius-200"
                                                                }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                                            >
                                                                <span className="sr-only">
                                                                    Use setting
                                                                </span>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={`${
                                                                        podcast.auto_sync
                                                                            ? "translate-x-9"
                                                                            : "translate-x-0"
                                                                    }
            pointer-events-none inline-block h-[24px] w-[23px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                                                />
                                                            </Switch>
                                                        </Switch.Group>
                                                    </div>
                                                </div>
                                                <div className="px-1 py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={(e) =>
                                                                    deletePodcast(
                                                                        e
                                                                    )
                                                                }
                                                                className={`${
                                                                    active
                                                                        ? "bg-audius-500 text-white"
                                                                        : "text-gray-900"
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                            >
                                                                {active ? (
                                                                    <DeleteActiveIcon
                                                                        className="mr-2 h-5 w-5 text-audius-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <DeleteInactiveIcon
                                                                        className="mr-2 h-5 w-5 text-audius-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                Delete Podcast
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                    <button
                                        onClick={(e) => refreshFeed(e)}
                                        type="button"
                                        className="sm:order-0 order-1 ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Refresh
                                    </button>
                                    <button
                                        onClick={(e) => syncAll(e)}
                                        target="_blank"
                                        className="order-0 inline-flex items-center rounded-md bg-audius-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-audius-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-audius-600 sm:order-1 sm:ml-3"
                                    >
                                        Sync All
                                    </button>
                                </div>
                            </div>

                            {/* Episodes table (small breakpoint and up) */}
                            <div className="block">
                                <div className="inline-block min-w-full border-b border-gray-200 align-middle">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-t border-gray-200">
                                                <th
                                                    className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                                    scope="col"
                                                >
                                                    <span className="lg:pl-2">
                                                        Episode
                                                    </span>
                                                </th>
                                                <th
                                                    className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell"
                                                    scope="col"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
                                                    scope="col"
                                                />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {podcast.items.map((episode) => (
                                                <tr key={episode.guid}>
                                                    <td className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                                        <div className="flex items-center space-x-3 lg:pl-2">
                                                            <div
                                                                className={classNames(
                                                                    "bg-audius-500",
                                                                    "h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            <p
                                                                href={
                                                                    episode.audius_url
                                                                }
                                                                className="truncate hover:text-gray-600"
                                                            >
                                                                {episode.title}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="hidden capitalize whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
                                                        {episode.status}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
                                                        {[
                                                            "unlisted",
                                                            "failed",
                                                        ].includes(
                                                            episode.status
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    syncEpisode(
                                                                        episode,
                                                                        episode.status ==
                                                                            "failed"
                                                                    )
                                                                }
                                                                className="text-audius-600 hover:text-audius-900"
                                                            >
                                                                Sync to Audius
                                                            </button>
                                                        )}
                                                        {episode.status ==
                                                            "synced" && (
                                                            <a
                                                                target="_blank"
                                                                href={
                                                                    episode.audius_url
                                                                }
                                                                className="text-audius-600 hover:text-audius-900"
                                                            >
                                                                Listen on Audius
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <aside className="fixed top-0 inset-y-0 right-0 hidden w-72 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 xl:block">
                <div className="pb-2 ">
                    <h2 className="text-sm font-semibold">Recent Activity</h2>
                </div>
                <div>
                    <ul role="list" className="divide-y divide-gray-200">
                        {syncs.map((item) => {
                            return (
                                item.status == "synced" && (
                                    <li key={item.id} className="py-4">
                                        <div className="flex space-x-3">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">
                                                        {item.automated && (
                                                            <span>
                                                                AudiusCast
                                                            </span>
                                                        )}
                                                        {!item.automated && (
                                                            <span>You</span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {item.synced_at}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Uploaded{" "}
                                                    <span className="font-medium text-gray-900">
                                                        {item.title}
                                                    </span>{" "}
                                                    to Audius
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </AuthenticatedLayout>
    );
}
