// Function to insert scripts into the head
export function insertScripts(scriptURLs) {
	scriptURLs.forEach((url) => {
		const scriptElement = document.createElement('script');
		scriptElement.src = url;
		document.head.appendChild(scriptElement);
	});
}

// Function to remove existing scripts (improved for efficiency)
export function removeExistingScripts(scriptsToRemove = []) {
	// Get all script elements in the head
	const existingScripts = document.head.querySelectorAll('script');

	// Efficiently filter and remove scripts based on provided array
	existingScripts.forEach((script) => {
		if (scriptsToRemove.length === 0 || !scriptsToRemove.includes(script.src)) {
			// Script not found in removal list or no removal list provided, keep it
			return;
		}

		// Script found in removal list, remove it
		script.remove();
	});
}

export const areArraysEqual = (arr1, arr2) => {
	if (arr1.length !== arr2.length) {
		return false;
	}
	const sortedArr1 = arr1.sort();
	const sortedArr2 = arr2.sort();
	return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

/**
 * Ejemplo de uso
		const miArreglo = [1, 2, 3, 4, 5];
		const arregloMezclado = shuffleArray(miArreglo);
 */
export function shuffleArray(array) {
	return array.sort(() => Math.random() - 0.5);
}
/**
 * La función `makeTextArray` toma un objeto como parámetro con las propiedades `txt` y `split`, y
 * divide la cadena `txt` utilizando el valor `split`. Si el valor `split` es `<br> `, también
 * reemplaza cualquier ocurrencia de `\n` con `<br> `. La función luego devuelve la matriz resultante.
 * @returns la matriz `cleantxt`.
 * ⚡⚡⚡ ejemplo de uso : makeTextArray({ imagen_arr, split: '<br>' });
 */
