import React from "react";

function useInView() {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = React.useState<boolean>(false);

	React.useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
            if (entry.isIntersecting) {
                setIsVisible(true);
				console.log(1)
                observer.disconnect();
            }
		});

		if (ref.current) observer.observe(ref.current);

		return () => {
			if (observer) observer.disconnect()
		};
	}, [ref]);

	return [ref, isVisible] as const;
}

export default useInView;